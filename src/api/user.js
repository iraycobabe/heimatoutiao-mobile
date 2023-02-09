// 用户相关请求模块
import request from '@/utils/request'
// import store from '@/store'

// 用户认证（登录注册）
export const login = data => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data: data
  })
}

// 发送短信验证码
// 发送验证码的GET请求 每个手机号每分钟1次
export const senSms = mobile => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`
  })
}

// 获取用户自己信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user'
    // headers: {
    //   // 注意：该接口需要授权才能访问
    //   // token的数据格式：Bearer token数据，注意 Bearer 后面有个空格
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}