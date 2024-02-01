const core = require("@babel/core");
const sourceCode = `
class Person {
  constructor(name) {
    this.name = name;
    console.log(aaa);
  }
  getName() {
    return this.name;
  }
}
`;

const RemoveConsolePlugin = {
  visitor: {
    ExpressionStatement(nodePath) {
      const { node } = nodePath;
      const { expression } = node;
      if (expression.type === "CallExpression") {
        const { callee } = expression;
        if (
          callee?.object?.name === "console" &&
          callee?.property?.name === "log"
        ) {
          nodePath.remove();
        }
      }
    },
  },
};

const targetCode = core.transform(sourceCode, {
  plugins: [RemoveConsolePlugin],
});

console.log(targetCode.code);
