// 文章接口模块
import request from '@/utils/request'

// 获取频道的文章列表
export const getArticles = params => {
  return request({
    ethod: 'GET',
    url: '/v1_0/articles',
    params
  })
}