<template>
  <van-icon
    class="like-article"
    :color="value ? '#ffa500' : '#777'"
    :name="value ? 'good-job' : 'good-job-o'"
    :loading="loading"
    @click="onLike"
  />
</template>
  
<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  props: {
    value: {
      type: Boolean,
      requried: true
    },
    articleId: {
      type: [Number, String, Object],
      requried: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async onLike () {
      this.loading = true
      // 这里 loading 不仅仅是为了交互提示，更重要的是请求期间禁用背景点击功能，防止用户不断的操作界面发出请求
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })

      try {
        // 如果已收藏，则取消收藏
        if (this.value) {
          await deleteLike(this.articleId)
          // this.value = false
          this.$toast.success('取消收藏')
        } else {
          // 添加收藏
          await addLike(this.articleId)
          // this.value = true
          this.$toast.success('收藏成功')
        }
        // 更新收藏按钮的视图 结果取this.value的反值即可
        this.$emit('input', !this.value)
      } catch (err) {
        console.log(err);
        this.$toast.fail('操作失败')
      }
      this.loading = false;
    }
  }
}
</script>
  
  <style scoped lang="less">
</style>