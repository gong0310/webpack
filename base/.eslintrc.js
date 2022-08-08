module.exports = {
  // 开发中一点点写 rules 规则太费劲了，所以有更好的办法，继承现有的规则
  // Eslint 官方的规则：eslint:recommended
  // Vue Cli 官方的规则：plugin:vue/essential
  // React Cli 官方的规则：react-app
  // 继承其他规则
  extends: ["eslint:recommended"],
  parser: "@babel/eslint-parser", // 支持最新的最终 ECMAScript 标准
  env: {
    node: true, // 启用node中全局变量，比如 module.xxx,require等等
    browser: true, // 启用浏览器中全局变量,比如 window.xxx，console.log等等
    // es6: true,
    // commonjs: true,
    // jest: true,
  },
  // 解析选项
  parserOptions: {
    ecmaVersion: 6, // ES 语法版本
    sourceType: "module", // ES 模块化
    ecmaFeatures: {
      // ES 其他特性
      jsx: true, // 如果是 React 项目，就需要开启 jsx 语法
    },
    requireConfigFile: false,
  },
  // 具体检查规则
  rules: {
    // 我们的规则可以覆盖掉extends的规则
    "no-var": 2, // 不能使用 var 定义变量
    semi: "error", // 禁止使用分号
    "array-callback-return": "warn", // 强制数组方法的回调函数中有 return 语句，否则警告
    "default-case": [
      "warn", // 要求 switch 语句中有 default 分支，否则警告
      { commentPattern: "^no default$" }, // 允许在最后注释 no default, 就不会有警告了
    ],
    eqeqeq: [
      "warn", // 强制使用 === 和 !==，否则警告
      "smart", // https://eslint.bootcss.com/docs/rules/eqeqeq#smart 除了少数情况下不会有警告
    ],
  },
  plugins: ["import"],
  // ...
  // 其他规则详见：https://eslint.bootcss.com/docs/user-guide/configuring
};
