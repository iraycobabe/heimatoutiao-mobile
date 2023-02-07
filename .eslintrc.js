module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    //在rules中添加自定义规则
    "vue/multi-word-component-names":"off",//关闭组件命名规则
    "vue/no-unused-components": "off", // 当存在定义而未使用的组件时，关闭报错
    "no-unused-vars":"off", // 当存在定义而未使用的变量时，关闭报错
    "no-trailing-spaces":"off",//这禁止掉 行尾空格
    'semi': 0,// 不检查；分号
    'eol-last': 0, // 取消最后一个空行的规则校验
  }
}
