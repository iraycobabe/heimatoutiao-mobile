import Vue from 'vue'
// 引入dayjs
import dayjs from 'dayjs'

// 引入相对时间relativeTime插件
import relativeTime from 'dayjs/plugin/relativeTime' // 用es6的语法引入

// 加载中文语言包
import 'dayjs/locale/zh-cn'

// 配置相对时间relativeTime插件
dayjs.extend(relativeTime)

// 配置使用中文语言包 dayjs默认英文 
dayjs.locale('zh-cn') // 全局配置

// 全局过滤器：处理相对时间 然后可以在任何组件的模版中使用了
// 过滤器相当于一个全局可用的方法（仅供模版使用）
// 参数1:过滤器名称
// 参数2:过滤器函数
// 使用方式： {{ 表达式 | 过滤器名称 }}
// 管道符前面的表达式的结果会作为参数传递到过滤器函数中
// 过滤器的返回值会渲染到使用过滤器的模版位置 
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})

// 通过dayjs()获取当前最新时间
// console.log(dayjs().format('YYYY-MM-DD'))

console.log(dayjs().from(dayjs('1990-01-01'))) // 33年内
console.log(dayjs().from(dayjs('1990-01-01'), true)) // 33年
console.log(dayjs().fromNow()) // 几秒前
console.log(dayjs().to(dayjs('1990-01-01'))) // 33年前
console.log(dayjs().toNow()) // 几秒前