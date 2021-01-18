import request from '@/utils/request'

export default{
  // ##获取树形结构数据
  getCategoryList(){
    return request({
      url: `/cms/category`,
      method: 'get'
    })
  }
}
