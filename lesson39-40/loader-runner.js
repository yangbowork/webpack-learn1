const path = require("path");
const fs = require("fs");
const readFile = fs.readFile.bind(fs); // 读取硬盘上文件的默认方法
const PATH_QUERY_FRAGMENT_REGEXP = /^([^?#]*)(\?[^#]*)?(#.*)?$/;
function parsePathQueryFragment(resource) {
  const result = PATH_QUERY_FRAGMENT_REGEXP.exec(resource);
  return {
    path: result[1],
    query: result[2],
    fragment: result[3],
  };
}
function createLoaderObject(request) {
  let loaderObj = {
    path: "", // loader的绝对路径
    query: "",
    fragment: "",
    options: null,
    normal: null, // loader函数本身
    pitch: null, // pitch函数本身
    raw: false, // 是否需要转成字符串,默认是转的
    data: {}, // 每个loader都会有一个自定义的data对象,用来存放一些自定义信息
    pitchExecuted: false, // pitch函数是否已经执行过了
    normalExecuted: false, // normal函数是否已经执行过了
  };
  // 可能会request inline-loader1?name=XXX#abc 这种loader
  Object.defineProperty("loaderObj", "request", {
    get() {
      return loaderObj.path + loaderObj.query + loaderObj.fragment;
    },
    set(request) {
      const splittedResource = parsePathQueryFragment(request);
      loaderObj.path = splittedResource.path;
      loaderObj.query = splittedResource.query;
      loaderObj.fragment = splittedResource.fragment;
    },
  });

  loaderObj.request(request);

  return loaderObj;
}

function iteratePitchingLoader(processOptions, loaderContext, callback) {}

function runLoaders(options, callback) {
  const resource = options.resource || ""; // 要加载的资源 c:/src/index.js?name=XXX#top
  let loaders = options.loaders || []; // loader绝对路径的数组
  const loaderContext = options.context || {}; // 这是一个对象,它将成为loader函数执行时候的上下文
  const readResource = options.readResource || readFile;
  const resourcePath = "";
  const resourceQuery = "";
  const resourceFragment = "";
  const contextDirectory = path.dirname(resourcePath); // 要加载的资源所在的目录

  loaders = loaders.map(createLoaderObject);

  loaderContext.context = contextDirectory;
  loaderContext.resourcePath = resourcePath;
  loaderContext.resourceQuery = resourceQuery;
  loaderContext.resourceFragment = resourceFragment;
  loaderContext.loaderIndex = 0; // 它是一个指标,就是通过修改它来控制当前在执行哪个loader
  loaderContext.loaders = loaders; // 存放着所有的loaders
  loaderContext.async = () => {
    return innerCallback;
  };
  const innerCallback = (loaderContext.callback = (err, ...values) => {});
  // 要加载的资源resource c:/src/index.js?name=XXX#top 不包含loader
  Object.defineProperty("loaderContext", "resource", {
    get() {
      return (
        loaderContext.resourcePath +
        loaderContext.resourceQuery +
        loaderContext.resourceFragment
      );
    },
    set(resource) {
      const splittedResource = parsePathQueryFragment(resource);
      loaderContext.resourcePath = splittedResource.path;
      loaderContext.resourceQuery = splittedResource.query;
      loaderContext.resourceFragment = splittedResource.fragment;
    },
  });

  // 要加载的资源resource c:/src/index.js?name=XXX#top 包含loader
  // loader1.js!loader2.js!loader3.js!c:/src/index.js?name=XXX#top
  Object.defineProperty("loaderContext", "request", {
    get() {
      return loaderContext.loaders
        .map((l) => l.request)
        .concat(loaderContext.resource)
        .join("!");
    },
  });

  Object.defineProperty("loaderContext", "remainingRequest", {
    get() {
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex + 1)
        .map((l) => l.request)
        .concat(loaderContext.resource)
        .join("!");
    },
  });

  Object.defineProperty("loaderContext", "currentRequest", {
    get() {
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex)
        .map((l) => l.request)
        .concat(loaderContext.resource)
        .join("!");
    },
  });

  Object.defineProperty("loaderContext", "previousRequest", {
    get() {
      return loaderContext.loaders
        .slice(0, loaderContext.loaderIndex)
        .map((l) => l.request)
        .join("!");
    },
  });
  // 当前loader的query
  Object.defineProperty("loaderContext", "query", {
    get() {
      let loaderObj = loaderContext.loaders[loaderContext.loaderIndex];
      return loaderObj.options || loaderObj.query;
    },
  });
  // 当前loader的data
  Object.defineProperty("loaderContext", "data", {
    get() {
      let loaderObj = loaderContext.loaders[loaderContext.loaderIndex];
      return loaderObj.data;
    },
  });

  let processOptions = {
    resourceBuffer: null,
  };

  iteratePitchingLoader(processOptions, loaderContext, (err, result) => {
    callback(err, {
      result,
      resourceBuffer: processOptions,
    });
  });
}

exports.runLoaders = runLoaders;
