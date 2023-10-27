const core = require("@babel/core");
const types = require("@babel/types");
const BabelPluginTransformClasses = require("@babel/plugin-transform-classes");
const sourceCode = `
class Person {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}
`;

// babel插件其实是一个对象，它会有一个visitor访问器
/**
 * 编写插件的一般步骤
 *  1. 仔细观察转换前和转换后的语法树，找到它们的相同点和不同点
 *  2. 想办法把转换前后的转成转换后的，并且要尽可能和复用旧节点
 *      老的没有，新的有，就得创建新节点了，可以babel-types可以创建新节点
 */

const BabelPluginTransformClasses2 = {
  // 每个插件都会有自己的访问器
  visitor: {
    ClassDeclaration(nodePath) {
      const { node } = nodePath;
      const { id } = node; // peison 标识符
      const classMethods = node.body.body; // 获取原来类的方法 construction getName
      const body = [];
      classMethods.forEach((method) => {
        if (method.kind === "constructor") {
          // 如果方法的类型是构造函数的话
          // id Person params=[name] body = this.name = name
          const constructorFunction = types.functionDeclaration(
            id,
            method.params,
            method.body,
            method.generator,
            method.async
          );
          body.push(constructorFunction);
        } else {
          // 普通的函数属于普通函数，是放在原形上的
          // method.key = getName
          const left = types.memberExpression(
            types.memberExpression(
              types.identifier(id.name),
              types.identifier("prototype")
            ),
            method.key
          );
          const right = types.functionExpression(
            null,
            method.params,
            method.body,
            method.generator,
            method.async
          );
          const assignmentExpression = types.assignmentExpression(
            "=",
            left,
            right
          );
          // body.push(assignmentExpression);
          body.push(types.expressionStatement(assignmentExpression));
        }
      });
      // nodePath.replaceWith(); // 替换成单节点
      nodePath.replaceWithMultiple(body); // 替换成多节点
    },
  },
};

const targetCode = core.transform(sourceCode, {
  plugins: [[BabelPluginTransformClasses2]],
});

console.log(targetCode.code);

// function Person(name) {
//   this.name = name;
// }
// Person.prototype.getName = function () {
//   return this.name;
// };
