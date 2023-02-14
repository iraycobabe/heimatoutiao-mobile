// 搜索相关请求模块
import request from '@/utils/request'
// import store from '@/store'

// 联想建议结果
export const getSuggestions = q => {
  return request({
    method: 'GET',
    url: '/v1_0/suggestion',
    params: {
      q 
    }
  })
}

// 搜索结果
export const getResults = params => {
  return request({
    method: 'GET',
    url: '/v1_0/search',
    params
  })
}