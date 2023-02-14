<template>
  <div class="search-container">
    <!-- vant组件搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮 -->
    <form class="search-form" action="/">
      <van-search
      v-model="searchText"
      show-action
      placeholder="请输入搜索关键词"
      background="#3296fa"
      @search="onSearch"
      @cancel="onCancel"
      @focus="isResultShow = false"
    />
    </form>

    <!-- 历史记录 -->
    <search-result 
      v-if="isResultShow"
      :search-text="searchText"
    />
    <!-- 联想建议 -->
    <search-suggestion 
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
    <!-- 搜索历史记录 -->
    <search-history 
      v-else
      :searchHistories="searchHistories"
      @search="onSearch"
    />
  </div>
</template>
  
<script>
import SearchHistory from './components/search-history.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import SearchResult from './components/search-result.vue'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchPage',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {},
  data () {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的显示状态
      searchHistories: getItem('serach-histories') || [] // 搜索历史记录数组  用从本地获取搜索历史记录的方法 或 空数组
    }
  },
  computed: {},
  watch: {
    searchHistories (val) {
      // 同步到本地存储
      setItem('serach-histories', val)
    }
  },
  created () {},
  methods: {
    onSearch (val) {
      // 更新文本框内容
      this.searchText = val
      // 存储搜索历史记录
      // 要求：不要有重复数据 最新的排在前面
      const index = this.searchHistories.indexOf(val) // 通过indexOf索引找val 如果数组有就返回该值 数组里没有酒返回-1
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val) // unshift() 把搜索的内容插在最前面
      // 显示搜索结果
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    }
  }
}
</script>
  
 <style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>