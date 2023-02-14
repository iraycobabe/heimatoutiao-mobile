<template>
  <!-- 用article-list类名 设置一个容器 使列表内容在容器内滚动 否则会在body内滚动-->
  <div class="article-list">
    <van-pull-refresh 
      v-model="isRefreshLoading" 
      @refresh="onRefresh" 
      :success-text="refreshSuccessText" 
      :success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list" 
          :key="index"
          :article="article"
        />
        <!-- <van-cell v-for="(article, index) in list" :key="index" :title="article.title" /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item/index.vue'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object, 
      required: true
    }
  },
  data () {
    return {
      list: [], // 存储列表数据
      loading: false, // 控制加载中loading的状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      isRefreshLoading: false, // 控制下拉刷新的状态
      refreshSuccessText: '刷新成功' // 下拉刷新成功提示文本
    }
  },
  methods: {
    // 初始化或滚动到底部的时候会触发调用onLoad
    async onLoad () {
      // 1.请求获取数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: this.timestamp || Date.now() // 时间戳：简单理解就是请求数据的页码 请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        }) 
        console.log(data)

        // 2. 把数据添加到 list 数组中
        const { results } = data.data
        // 数组的展开操作符，它会把数组元素一个一个拿出来
        this.list.push(...results)

        // 3. 设置本次加载中 loading 状态结束
        this.loading = false

        // 4. 判断数据是否加载结束
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，设置加载状态结束，不再触发上拉加载更多了
          this.finished = true
        }
      } catch (err) {
        console.log('请求失败', err)
        this.error = true // 开启错误提示
        this.loading = false // 关闭 loading 效果
      }
    },
    // 当下拉刷新会触发该函数
    async onRefresh () {
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道 id
          timestamp: Date.now() // 下拉刷新每次都应该获取最新数据
        })

        // 2. 将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...results) // unshift 将数据追加到顶部

        // 3. 关闭下拉刷新的 loading 状态
        this.isRefreshLoading = false

        // 提示成功
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        console.log(err)
        this.isRefreshLoading = false // 关闭下拉刷新的 loading 状态
        this.$toast('刷新失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  // height: 100%; // 百分比是相对于父元素的 
  height: 79vh; // vh单位 是视口的79%
  overflow-y: auto;
}
</style>