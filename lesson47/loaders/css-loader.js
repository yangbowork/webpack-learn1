const postcss = require("postcss");
const Tokenizer = require("css-selector-tokenizer");
// webpack5 已经内置了getOptions
// webpack5 已经内置了utils， 转换绝对/相对路径替代了stringifyRequest
// const { getOptions, stringifyRequest } = require("loader-utils") // 需要安装 V3.0.0以下版本

function loader(inputSource) {
  const loaderOptions = this.getOptions() || {};
  const callback = this.async();
  const cssPlugin = (options) => {
    return (root) => {
      if (loaderOptions.import) {
        // 1.删除所有的@import 2.把导入的CSS文件路径
        root.walkAtRules(/^import$/i, (rule) => {
          rule.remove(); // 在CSS脚本里把这@import删除
          options.imports.push(rule.params.slice(1, -1)); // ./global.css
        });
      }
      if (loaderOptions.url) {
        // 2.遍历语法树，找到里面所有的url
        root.walkDecls((decl) => {
          let values = Tokenizer.parseValues(decl.value);
          values.nodes.forEach((node) => {
            node.nodes.forEach((item) => {
              if (item.type === "url") {
                // 把任意路径标准化为相对路径
                let url = JSON.stringify(
                  this.utils.contextify(this.context, item.url)
                );
                item.stringType = "'";
                // item.url = "${require(" + url + ")}";
                item.url = "`+require(" + url + ")+`";
                // require会给webpack看和分析，webpack一看你引入了一张照片
                // webpack会使用file-loader去加载图片
              }
            });
          });
          let value = Tokenizer.stringifyValues(values);
          decl.value = value;
        });
      }
    };
  };

  // 将会用它来收集所有的@import
  const options = { imports: [] };
  const pipeline = postcss([cssPlugin(options)]);
  pipeline.process(inputSource).then((result) => {
    const { importLoaders } = loaderOptions; // 几个前置loader
    const { loaders, loaderIndex } = this; // 所有的loader数组和当前loader的索引
    const loaderRequest = loaders
      .slice(loaderIndex, loaderIndex + 1 + importLoaders)
      .map((l) => l.request)
      .join("!");
    // !!css-loader.js的绝对路径!less-loader.js的绝对路径!./global.css
    const importCss = options.imports.map((url) => {
      return `list.push(require(${JSON.stringify(
        this.utils.contextify(this.context, `!!${loaderRequest}!${url}`)
      )}))`;
    });

    let script = `
      var list = []
      list.toString = function(){return this.join('')}
      ${importCss}
      list.push(\`${result.css}\`);
      module.exports = list.toString();
    `;
    callback(null, script);
  });
}

module.exports = loader;
