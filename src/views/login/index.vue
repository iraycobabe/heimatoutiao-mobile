<template>
  <div>
    <div class="login-container">
      <!-- 导航栏 -->
      <van-nav-bar title="登录" class="page-nav-bar">
        <van-icon slot="left" name="cross" @click="$router.back()"/>
      </van-nav-bar>
      <!-- 登录表单 -->
      <!-- 通过 ref 可以获取到 Form 实例并调用实例方法 -->
      <van-form ref="loginForm" @submit="onSubmit">
        <!--
        表单验证：
        1、给 van-field 组件配置 rules 验证规则
           参考文档：https://youzan.github.io/vant/#/zh-CN/form#rule-shu-ju-jie-gou
        2、当表单提交的时候会自动触发表单验证
           如果验证通过，会触发 submit 事件
           如果验证失败，不会触发 submit
        -->
        <van-field
          v-model="user.mobile"
          name="mobile"
          placeholder="请输入手机号"
          :rules="userFormRules.mobile"
          type="number"
          maxlength="11"
        >
            <i slot="left-icon" class="toutiao toutiao-shouji"></i>
        </van-field>
        <van-field
          v-model="user.code"
          name="code"
          placeholder="请输入验证码"
          :rules="userFormRules.code"
          type="number"
          maxlength="6"
        >
            <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
            <template #button>
                <!-- :time="" 倒计时时间 -->
                <van-count-down 
                v-if="isCountDownShow"
                :time="1000 * 60" 
                format="ss s" 
                @finish="isCountDownShow = false"
                 />
                <!-- native-type="button" 只触发这个按钮 不冒泡触发表单按钮 -->
                <van-button 
                v-else
                class="send-sms-btn" 
                native-type="button" 
                round size="small" 
                type="default"
                @click="onSendSms"
                >
                获取验证码
                </van-button>
            </template>
        </van-field>
        <div class="login-btn-wrap">
          <van-button class="login-btn " block type="info" native-type="submit"
            >登录</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { login, senSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      userFormRules: {
        mobile: [{ 
          required: true, 
          message: '手机号不能为空' 
        }, {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{ 
          required: true,
          message: '验证码不能为空' 
        }, {
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
        }]
      },
      isCountDownShow: false // 是否展示倒计时 
    };
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onSubmit () {
      // 1.获取表单数据
      const user = this.user
      // 2.表单验证
      // 在组件中必须通过this.$toast来调用Toast组件
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 是否禁止背景点击
        duration: 0 // 持续时间默认是2000 如果为0 则持续展示 toast
      })
      // 3.提交表单请求登录
      try {
        const { data } = await login(user)
        //  登录成功以后将后端返回的 token 相关数据存储到容器中
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功') 
        // 登录成功，跳转回个人中心页面
        // back方式不严谨，后边优化
        this.$router.back()
        // Toast 默认采用单例模式，即同一时间只会存在一个 Toast，下一个Toast出现上一个会停用
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      // 4.根据请求响应结果处理后续操作
      }
    },
    async onSendSms () {
      // 1. 校验手机号
      try {
        await this.$refs.loginForm.validate('mobile') // 验证表单，支持传入 name 来验证单个或部分表单项
        console.log('验证通过')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 2. 验证通过，显示倒计时
      this.isCountDownShow = true
      // 3. 请求发送验证码
      try {
        await senSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        this.isCountDownShow = false // 发送失败 关闭倒计时
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
    .toutiao {
        font-size: 37px;
    }
}
.send-sms-btn {
    background-color: rgb(237, 237, 237);
    width: 162px;
    height: 46px;
    line-height: 46px;
    font-size: 22px;
    color: rgb(102, 102, 102);
}
.login-btn-wrap {
    padding: 53px 28px;
    .login-btn {
        background-color: rgb(109, 180, 251);
        border: none ;
    }
}
</style>