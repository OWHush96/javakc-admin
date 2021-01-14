// ##用来进行封装axios异步请求技术
import request from '@/utils/request'
const api_name='/cms/book'
export default{
  // ## 根据条件进行分页查询
  pageBook(pageNo,pageSize,bookQuery){
    return request({
      url: `${api_name}/${pageNo}/${pageSize}`,
      method: 'post',
      data: bookQuery
    })
  },
  // ## 添加书籍
  saveBook(book){
    return request({
      url: `${api_name}/saveBook`,
      method: 'post',
      data: book
    })
  },
  // ##回显
  view(bookId){
    return request({
      url: `${api_name}/${bookId}`,
      method: 'get'
    })
  },
  // ##修改
  updateBook(book) {
    return request({
      url: `${api_name}/updateBook`,
      method: 'put',
      data: book
    })
  },
  // ## 删除
  deleteBook(bookId){
    return request({
      url: `${api_name}/${bookId}`,
      method: 'delete'
    })
  },
  // ## 上架下架状态
  upOrDownBook(bookId,isOnline){
    return request({
      url: `${api_name}/${bookId}/${isOnline}`,
      method: 'put'
    })
  }
}
