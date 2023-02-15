module.exports = {
    plugins: {
      // VueCli内部已经配置了autoprefixer插件
      // 这里又配置了一遍所以产生了冲突
      // 这里可以注释掉autoprefixer
      // 'autoprefixer': {
      //   browsers: ['Android >= 4.0', 'iOS >= 8']
      // },


      // 配置使用 postcss-pxtorem 插件
      // 作用：把 px 转为 rem
      'postcss-pxtorem': {
        // 如果是vant的样式 按照37.5来转
        // 如果是自己的样式 按照75来转
        // `rootValue` 支持两种参数类型
        // 数字：固定值
        // 函数：动态计算返回
        // postcss-pxtorem 处理每个 CSS 文件的时候都会来调用这个函数
        // 它会把被处理的 CSS 文件相关的信息通过参数传递给该函数
        // 所以我们修改配置如下：
        rootValue ({ file }) { // 再file里检索vant，有就是37.5，没有就是75
          return file.indexOf('vant') !== -1 ? 37.5 : 75
        },
        // 配置要转换的css属性
        // *表示所有属性 比如：height width
        propList: ['*'],

        // 排除不要转换的样式资源
        exclude: 'github-markdown.css'
      }
    }
  }