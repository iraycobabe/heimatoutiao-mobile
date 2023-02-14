<template>
  <div class="search-suggestion">
    <van-cell 
      icon="search"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search', text)"
    >
      <span slot="title" v-html="highlight(text)"></span>
    </van-cell>

    <!-- 双花括号绑定会直接输出纯文本内容 -->
    <!-- <div>{{ htmlStr }}</div> -->

    <!-- 使用v-html指令可以绑定渲染带有html标签的文本内容 -->
    <!-- <div v-html="htmlStr"></div> -->
  </div>
</template>
  
<script>
import { getSuggestions } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数组
      // htmlStr: 'Hello <span style="color: red">World</span>'
    }
  },
  computed: {},
  watch: {
    searchText: {
      // 当searchText发生改变 就会调用handler函数 
      // debounce(一个函数，延迟时间)
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 1000) 
    },
    immediate: true // 该回调将会在侦听开始之后被立即调用
  },
  created () {},
  mounted () {},
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSuggestions(q) 
        this.suggestions = data.data.options
      } catch (err) {
        console.log(err)
        this.$toast('获取搜索联想失败')
      }
    },
    highlight (text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // 正则表达式中间的内容都会当作匹配字符来使用,而不是数据变量 
      // 如果需要根据数据动态的创造正则表达式 则手动 new RegExp
      // RegExp(匹配模式字符串 根据字符串创造正则对象，匹配模式 写到字符串中) 正则表达式构造函数
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
    }
  }
}
</script>
  
<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>