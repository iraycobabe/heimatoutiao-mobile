<template>    
  <van-button
    v-if="value"
    class="follow-btn"
    round
    size="small"
    :loading="loading"
    @click="onFollow"
    >已关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="loading"
    @click="onFollow"
    >关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async onFollow () {
      this.loading = true // 点击后展示loading 
      try {
        if (this.value) {
          // 已关注状态 点击取消关注
          await deleteFollow(this.userId)
          this.$emit('input', false)
          // this.value = false 
        } else {
          // 未关注状态 点击关注
          await addFollow(this.userId)
          this.$emit('input', true)
          // this.value = true
        }
      } catch (err) {
        let message = '操作失败，请重试！'
        if (err.response && err.response.status === 400) {
          message = '不能关注自己！'
        }
        this.$toast(message)
      }
      this.loading = false // 关闭loading
    }
  }
}
</script>

<style>
</style>