const core = require("@babel/core");
const types = require("@babel/types");
const template = require("@babel/template");

const sourceCode = `
function sum (a, b, c) {
  return a + b + c
}
`;

// babel插件其实是一个对象，它会有一个visitor访问器
/**
 * 编写插件的一般步骤
 *  1. 仔细观察转换前和转换后的语法树，找到它们的相同点和不同点
 *  2. 想办法把转换前后的转成转换后的，并且要尽可能和复用旧节点
 *      老的没有，新的有，就得创建新节点了，可以babel-types可以创建新节点
 */

const TryCatchTransformClasses = {
  // 每个插件都会有自己的访问器
  visitor: {
    FunctionDeclaration: function (nodePath) {
      const { node } = nodePath;
      const { id } = node;
      const blockStatement = node.body;
      // 如果此函数的第一个语句已经是一个try语句了，就不要在处理了，否则会死循环
      if (blockStatement.body && types.isTryStatement(blockStatement.body[0])) {
        return;
      }
      // 把一个JS字符串转成AST语法树节点 CallExpression
      const catchStatement = template.statement("console.log(error)")();
      const catchClause = types.catchClause(
        types.identifier("error"),
        types.blockStatement([catchStatement])
      );
      // node.body就是原来的函数里的语句，现在要放在try里面
      const tryStatement = types.tryStatement(node.body, catchClause);
      // 新的函数方法名不变sum，参数不变a，b
      const func = types.functionExpression(
        id,
        node.params,
        types.blockStatement([tryStatement]),
        node.generator,
        node.async
      );
      // nodePath.replaceWith(func);
    },
  },
};

const targetCode = core.transform(sourceCode, {
  plugins: [TryCatchTransformClasses],
});

console.log(targetCode.code);
