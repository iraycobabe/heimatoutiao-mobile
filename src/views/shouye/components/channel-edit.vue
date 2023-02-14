<template>
  <div class="channel-edit">
    <!-- 我的频道单元格 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edt-btn"
        size="mini"
        round
        type="danger"
        plain
        @click="isEdit = !isEdit"
      >{{ isEdit ? '完成' : '编辑 ' }}
      </van-button>
    </van-cell>
    <!-- 宫格 -->
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        class="channel-item"
        v-for="(channel, index) in myChannelsItem"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <!-- 用插槽icon 可以设定icon的显示状态 -->
        <!-- 编辑状态下fixedChannels.includes(channel.id) 只有数组id为0的显示clear图标 -->
        <!-- !fixedChannels.includes(channel.id) 取反 就是非数组id为0的 都显示clear图标  -->
        <van-icon 
          v-show="isEdit && !fixedChannels.includes(channel.id)" 
          slot="icon" 
          name="clear"
        ></van-icon>
        <!-- 文本插槽可以改变样式 -->
        <!-- v-band:class语法：
        对象中key表示css类名 value要计算出布尔值 true为作用 false为不作用 -->
        <span 
          slot="text" 
          class="text"
          :class="{ active: index === active}"
        >{{ channel.name }}
        </span>
      </van-grid-item>
    </van-grid> 

    <!-- 频道推荐单元格 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <!-- 宫格 -->
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item
        class="channel-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        icon="plus"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid> 
  </div>
</template>
  
<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true 
    },
    active: {
      type: Number,
      required: true  
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      myChannelsItem: this.myChannels, // 使props变成可变更数组
      isEdit: false, // 默认编辑状态是false
      fixedChannels: [0] // 固定频道 不允许删除
    }
  },
  computed: {
    ...mapState(['user']), // ...是扩展运算符 将变量里的每一项都拆出来 数组里放入user将user拆出来
    recommendChannels () {
      // 数组的 filter方法：
      // 遍历数组，把符合条件的元素存储到新的数组中
      return this.allChannels.filter(channel => {
        return !this.myChannelsItem.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
    }
    // recommendChannels () {
    //   const channels = []
    //   this.allChannels.forEach(channel => {
    //     // find() 遍历函数 查找符合条件的元素
    //     const ret = this.myChannels.find(myChannel => {
    //       return myChannel.id === channel.id
    //     })
    //     // 取反 不包含在内的项 
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })
    //   return channels
    // }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel (channel) {
      // 数据持久化处理
      try {
        this.myChannelsItem.push(channel)
        if (this.user) {
          // vuex中的user有数据 已登录，数据存储到线上
          await addUserChannel({
            id: channel.id, // 频道 id
            seq: this.myChannelsItem.length // 频道的 序号
          })
        } else {
          // 未登录，数据存储到本地
          setItem('TOUTIAO_CHANNELS', this.myChannelsItem)
        } 
      } catch (err) {
        this.$toast('添加频道失败')
      } 
    },
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        if (this.fixedChannels.includes(channel.id)) {
          // 1.如果是固定频道则不删除
          return
        }
        // 2.如果是编辑状态 则执行删除频道
        // splice()删除方法： 参数1 索引 参数2 要删除的个数 不指定的话就从参数1开始一直删到最后 
        this.myChannelsItem.splice(index, 1)
        if (index <= this.active) {
          // 3.让激活频道的索引 减1
          // 用this.$emit 传给父组件update-active事件 传入this.active - 1
          // true是传给父组件里onUpdateActive函数中isChannelEditShow的参数
          this.$emit('update-active', this.active - 1, true)
        }
        // 4.处理持久化
        this.deleteChannel(channel)
      } else {
        // 5. 非编辑状态 执行切换频道
        // 用this.$emit 传给父组件update-active事件 利用索引=active 并关闭编辑层
        // false是传给父组件里onUpdateActive函数中isChannelEditShow的参数
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登录，将数据存储到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，将数据存储到本地
          setItem('channles', this.myChannelsItem) 
        }
      } catch (err) {
        console.log(err)
        this.$toast('删除频道失败，请稍后重试')
      }
    }
  }
}
</script>
  
<style scoped lang="less">
.channel-edit {
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edt-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  } 
  .channel-item {
    width: 160px;
    height: 86px;
    /deep/ .van-grid-item__content {
        white-space: nowrap; // 内部文字内容不折行
      background-color: #f5f5f6;
      .van-grid-item__text, .text {
        color: #222;
        font-size: 28px;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset; 
      }
    }
  }
  /deep/ .my-grid {
    .channel-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
      .van-grid-item__text {
        margin-bottom: 14px;
      }
    }
  }
  /deep/ .recommend-grid {
    .channel-item {
      .van-grid-item__content {
        flex-direction: row; // 水平排列 row
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
        .van-grid-item__text {
          margin-top: 0;
        }
      }
    }
  }
}
</style>  