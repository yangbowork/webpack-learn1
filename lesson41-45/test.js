(() => {
  var __webpack_modules__ = {
    "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./src/global.css":
      (module, __unused_webpack_exports, __webpack_require__) => {
        var ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ = __webpack_require__(
          "./node_modules/css-loader/dist/runtime/noSourceMaps.js"
        );
        var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(
          "./node_modules/css-loader/dist/runtime/api.js"
        );
        var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(
          ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___
        );
        ___CSS_LOADER_EXPORT___.push([
          module.id,
          `body {
  color: red;
}`,
          "",
        ]);
        module.exports = ___CSS_LOADER_EXPORT___;
      },
    "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./src/index.css":
      (module, __unused_webpack_exports, __webpack_require__) => {
        var ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ = __webpack_require__(
          "./node_modules/css-loader/dist/runtime/noSourceMaps.js"
        );
        var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(
          "./node_modules/css-loader/dist/runtime/api.js"
        );
        var ___CSS_LOADER_AT_RULE_IMPORT_0___ = __webpack_require__(
          "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./src/global.css"
        );
        var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(
          ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___
        );
        ___CSS_LOADER_EXPORT___.i(___CSS_LOADER_AT_RULE_IMPORT_0___);
        ___CSS_LOADER_EXPORT___.push([
          module.id,
          `body {
  background: green;
}`,
          "",
        ]);
        module.exports = ___CSS_LOADER_EXPORT___;
      },
    "./node_modules/css-loader/dist/runtime/api.js": (module) => {
      "use strict";
      module.exports = function (cssWithMappingToString) {
        var list = [];
        list.toString = function toString() {
          return this.map(function (item) {
            var content = "";
            var needLayer = typeof item[5] !== "undefined";
            if (item[4]) {
              content += "@supports (".concat(item[4], ") {");
            }
            if (item[2]) {
              content += "@media ".concat(item[2], " {");
            }
            if (needLayer) {
              content += "@layer".concat(
                item[5].length > 0 ? " ".concat(item[5]) : "",
                " {"
              );
            }
            content += cssWithMappingToString(item);
            if (needLayer) {
              content += "}";
            }
            if (item[2]) {
              content += "}";
            }
            if (item[4]) {
              content += "}";
            }
            return content;
          }).join("");
        };
        list.i = function i(modules, media, dedupe, supports, layer) {
          if (typeof modules === "string") {
            modules = [[null, modules, undefined]];
          }
          var alreadyImportedModules = {};
          if (dedupe) {
            for (var k = 0; k < this.length; k++) {
              var id = this[k][0];
              if (id != null) {
                alreadyImportedModules[id] = true;
              }
            }
          }
          for (var _k = 0; _k < modules.length; _k++) {
            var item = [].concat(modules[_k]);
            if (dedupe && alreadyImportedModules[item[0]]) {
              continue;
            }
            if (typeof layer !== "undefined") {
              if (typeof item[5] === "undefined") {
                item[5] = layer;
              } else {
                item[1] = "@layer"
                  .concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {")
                  .concat(item[1], "}");
                item[5] = layer;
              }
            }
            if (media) {
              if (!item[2]) {
                item[2] = media;
              } else {
                item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
                item[2] = media;
              }
            }
            if (supports) {
              if (!item[4]) {
                item[4] = "".concat(supports);
              } else {
                item[1] = "@supports ("
                  .concat(item[4], ") {")
                  .concat(item[1], "}");
                item[4] = supports;
              }
            }
            list.push(item);
          }
        };
        return list;
      };
    },
    "./node_modules/css-loader/dist/runtime/noSourceMaps.js": (module) => {
      "use strict";
      module.exports = function (i) {
        return i[1];
      };
    },
    "./src/index.css": (
      module,
      __unused_webpack_exports,
      __webpack_require__
    ) => {
      var result = __webpack_require__(
        "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./src/index.css"
      );
      if (result && result.__esModule) {
        result = result.default;
      }
      if (typeof result === "string") {
        module.exports = result;
      } else {
        module.exports = result.toString();
      }
    },
  };
  var __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (__webpack_module_cache__[moduleId] = {
      id: moduleId,
      exports: {},
    });
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }
  var __webpack_exports__ = {};
  (() => {
    const css = __webpack_require__("./src/index.css");
    console.log(css);
  })();
})();
