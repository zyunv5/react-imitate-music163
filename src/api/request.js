import { axiosInstance } from './config'

export const getBannerRequest = () => {
  return axiosInstance.get('/banner')
}

export const getRecommendListRequest = () => {
  return axiosInstance.get('/personalized')
}

//获取热门歌手
export const getHotSingerListRequest = (count) => {
  return axiosInstance.get(`/artist/list?offset=${count * 30}`)
}
//获取歌手分类
export const getSingerListRequest = (category, area, alpha, count) => {
  return axiosInstance.get(`/artist/list?type=${category || 0}&area=${area || 0}&initial=${alpha.toLowerCase() || ''}&offset=${count * 30}`)
}
//获取歌手排行榜
export const getRankListRequest = () => {
  return axiosInstance.get(`/toplist/detail`)
}
