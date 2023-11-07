const path = require("path");
const fs = require("fs");
const readFile = fs.readFile.bind(this); // 读取硬盘上文件的默认方法
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
    raw: false, // 是否需要转成字符串，默认是转的
    data: {}, // 每个loader都会有一个自定义的data对象，用来存放一些自定义信息
    pitchExecuted: false, // pitch函数是否已经执行过了
    normalExecuted: false, // normal函数是否已经执行过了
  };
  // 可能会request inline-loader1?name=XXX#abc 这种loader
  Object.defineProperty(loaderObj, "request", {
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
  loaderObj.request = request;

  const normal = require(loaderObj.path);
  loaderObj.normal = normal;
  loaderObj.raw = normal.raw;
  let pitch = normal.pitch;
  loaderObj.pitch = pitch;
  return loaderObj;
}
function processResource(processOptions, loaderContext, finalCallback) {
  loaderContext.loaderIndex = loaderContext.loaders.length - 1; // 索引等最后一个loader的索引
  const resourcePath = loaderContext.resourcePath; // c:/src/index.js
  loaderContext.readResource(resourcePath, (err, resourceBuffer) => {
    if (err) finalCallback(err);
    processOptions.resourceBuffer = resourceBuffer; // 放的是资源的原始内容
    iterateNormalLoaders(
      processOptions,
      loaderContext,
      [resourceBuffer],
      finalCallback
    );
  });
}
function iterateNormalLoaders(
  processOptions,
  loaderContext,
  args,
  finalCallback
) {
  // 如果索引已经小于0了，就表示所有的normal执行完成了
  if (loaderContext.loaderIndex < 0) {
    return finalCallback(null, args);
  }
  const currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
  if (currentLoaderObject.normalExecuted) {
    loaderContext.loaderIndex--;
    return iterateNormalLoaders(
      processOptions,
      loaderContext,
      args,
      finalCallback
    );
  }
  const normalFunction = currentLoaderObject.normal;
  currentLoaderObject.normalExecuted = true;
  convertArgs(args, currentLoaderObject.raw);
  runSyncOrAsync(normalFunction, loaderContext, args, (err, ...values) => {
    if (err) return finalCallback(err);
    iterateNormalLoaders(processOptions, loaderContext, values, finalCallback);
  });
}
function convertArgs(args, raw) {
  if (raw && !Buffer.isBuffer(args[0])) {
    // 想要Buffer，但不是Buffer，转成Buffer
    args[0] = Buffer.from(args[0]);
  } else if (!raw && Buffer.isBuffer(args[0])) {
    // 不想要Buffer，但是Buffer，转成字符串
    args[0] = args[0].toString("utf8");
  }
}
/**
 * 执行loader的pitch方法
 * @param {*} processOptions { resourceBuffer }
 * @param {*} loaderContext loader里的this，就是所谓的上下文对象loaderContext
 * @param {*} finalCallback loader里全部执行完会执行此回调
 */
function iteratePitchingLoaders(processOptions, loaderContext, finalCallback) {
  // 如果已经越界了，读取最右边的一个loader的右边了
  if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
    return processResource(processOptions, loaderContext, finalCallback);
  }
  // 获取当前的loader
  const currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
  if (currentLoaderObject.pitchExecuted) {
    loaderContext.loaderIndex++;
    return iteratePitchingLoaders(processOptions, loaderContext, finalCallback);
  }
  const pitchFunction = currentLoaderObject.pitch;
  currentLoaderObject.pitchExecuted = true; // 表示pitch函数已经执行过了
  if (!pitchFunction)
    return iteratePitchingLoaders(processOptions, loaderContext, finalCallback);
  else {
    runSyncOrAsync(
      pitchFunction,
      loaderContext,
      [
        loaderContext.remainingRequest,
        loaderContext.previousRequest,
        loaderContext.data,
      ],
      (err, ...values) => {
        if (err) return finalCallback(err);
        // 如果有返回值
        if (values.length > 0 && !!values[0]) {
          loaderContext.loaderIndex--; // 索引减一，回到上一个loader，执行上一个loader的normal方法
          iterateNormalLoaders(processOptions, context, values, finalCallback);
        } else {
          iteratePitchingLoaders(processOptions, loaderContext, finalCallback);
        }
      }
    );
  }
}

// 每个loader函数的执行同步异步都是独立的
function runSyncOrAsync(fn, context, args, callback) {
  isSync = true; // 是否同步，默认是的
  isDone = false; // 是否fn已经执行完成，默认是false
  const innerCallback = (context.callback = function (err, ...values) {
    isSync = false;
    isDone = true;
    callback.apply(err, ...values);
  });
  context.async = () => {
    isSync = false; // 把同步标志置为false，意思就是改为异步
    return innerCallback;
  };
  // pitch的返回值可有可无
  const result = fn.apply(context, args);
  // 如果isSync标志是true，意味着是同步
  if (isSync) {
    isDone = true; //直接完成
    return callback(null, result); //调用回调
  }
}
function runLoaders(options, callback) {
  const resource = options.resource || ""; // 要加载的资源 c:/src/index.js?name=XXX#top
  let loaders = options.loaders || []; // loader绝对路径的数组
  const loaderContext = options.context || {}; // 这是一个对象，它将成为loader函数执行时候的上下文
  const readResource = options.readResource || readFile;
  const splittedResource = parsePathQueryFragment(resource);
  const resourcePath = splittedResource.path;
  const resourceQuery = splittedResource.query;
  const resourceFragment = splittedResource.fragment;
  const contextDirectory = path.dirname(resourcePath); // 要加载的资源所在的目录

  loaders = loaders.map(createLoaderObject);

  loaderContext.context = contextDirectory;
  loaderContext.resourcePath = resourcePath;
  loaderContext.resourceQuery = resourceQuery;
  loaderContext.resourceFragment = resourceFragment;
  loaderContext.readResource = readResource;
  loaderContext.loaderIndex = 0; // 它是一个指标，就是通过修改它来控制当前在执行哪个loader
  loaderContext.loaders = loaders; // 存放着所有的loaders
  loaderContext.async = null;
  loaderContext.callback = null;
  // 要加载的资源resource c:/src/index.js?name=XXX#top 不包含loader
  Object.defineProperty(loaderContext, "resource", {
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
  Object.defineProperty(loaderContext, "request", {
    get() {
      return loaderContext.loaders
        .map((l) => l.request)
        .concat(loaderContext.resource)
        .join("!");
    },
  });

  Object.defineProperty(loaderContext, "remainingRequest", {
    get() {
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex + 1)
        .map((l) => l.request)
        .concat(loaderContext.resource)
        .join("!");
    },
  });

  Object.defineProperty(loaderContext, "currentRequest", {
    get() {
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex)
        .map((l) => l.request)
        .concat(loaderContext.resource)
        .join("!");
    },
  });

  Object.defineProperty(loaderContext, "previousRequest", {
    get() {
      return loaderContext.loaders
        .slice(0, loaderContext.loaderIndex)
        .map((l) => l.request)
        .join("!");
    },
  });
  // 当前loader的query
  Object.defineProperty(loaderContext, "query", {
    get() {
      let loaderObj = loaderContext.loaders[loaderContext.loaderIndex];
      return loaderObj.options || loaderObj.query;
    },
  });
  // 当前loader的data
  Object.defineProperty(loaderContext, "data", {
    get() {
      let loaderObj = loaderContext.loaders[loaderContext.loaderIndex];
      return loaderObj.data;
    },
  });

  let processOptions = {
    resourceBuffer: null,
  };

  iteratePitchingLoaders(processOptions, loaderContext, (err, result) => {
    callback(err, {
      result,
      resourceBuffer: processOptions,
    });
  });
}

exports.runLoaders = runLoaders;
