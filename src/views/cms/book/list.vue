<template>
  <div id="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="书名">
        <el-input v-model="bookQuery.bookName" placeholder="书名"></el-input>
      </el-form-item>
      <el-form-item label="授权开始时间">
        <el-date-picker
          v-model="bookQuery.beginDate"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
          />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="bookQuery.endDate"
          type="datetime"
          placeholder="选择截至时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="pageBook()">查询</el-button>
        <el-button type="primary" @click="reset()">清空</el-button>
        <router-link :to="'/cms/book/create'">
          <el-button type="primary" >添加书籍</el-button>
        </router-link>
      </el-form-item>
    </el-form>
<!--    <书籍列表>-->
    <el-table :data="bookList" border fit highlight-current-row>
      <el-table-column label="序号" width ="70" align="center">
        <template slot-scope="scope">
          {{(pageNo-1) * pageSize + scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column prop="id" label="书籍Id"/>
      <el-table-column prop ="bookName" label="书名"/>
      <el-table-column prop ="author" label="作者"/>
      <el-table-column prop ="level1Id" label="一级分类" :formatter="formatFirst"/>
      <el-table-column prop ="level2Id" label="二级分类" :formatter="formatSecond"/>
      <el-table-column prop ="isSerialize" label="连载">
        <template slot-scope="scope">
          {{scope.row.isSerialize === 1?'连载中' : '完结'}}
        </template>
      </el-table-column>
      <el-table-column prop ="wordNumber" label="字数"/>
      <el-table-column prop label="状态">
        <template slot-scope="scope">
         {{scope.row.isOnline === 1?'上线':'未上线'}}
        </template>
      </el-table-column>
      <el-table-column label="全本收费">
        <template slot-scope="scope">
          {{scope.row.isCharge === 1?'收费':'免费'}}
        </template>
      </el-table-column>
      <el-table-column prop ="grantStartTime" label="授权开始时间"/>
      <el-table-column prop ="grantEndTime" label="授权结束时间"/>
      <el-table-column label="原创">
       <template slot-scope="scope">
        {{scope.row.isOriginal ===1?'是':'否'}}
       </template>
      </el-table-column>
      <el-table-column label="授权状态">
        <template slot-scope="scope">
          {{ currentTime > scope.row.grantEndTime ? '过期' : '有效' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteBook(scope.row.id, scope.row.isOnline)">删除</el-button>
          <router-link :to="'/cms/book/update/'+scope.row.id">
            <el-button type="primary" size="mini">修改</el-button>
          </router-link>
          <el-button v-if="scope.row.isOnline === 0" type="danger" size="mini" icon="el-icon-delete" @click="upOrDownBook(scope.row.id,1)">上架书籍</el-button>
          <el-button v-else type="danger" size="mini" @click="upOrDownBook(scope.row.id, 0)">下架书籍</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页-->
    <el-pagination
      :page-size="pageSize"
      :current-page="pageNo"
      :total="total"
      :page-count="11"
      style="padding: 30px 0; text-align: center;"
      layout="total,prev,pager,next,jumper"
      @current-change="pageBook">
    </el-pagination>

  </div>
</template>

<script>
import book from '@/api/cms/book'
import category from "@/api/cms/category";
export default {
 // ##data用来定义变量，并为其初始化内容
  data() {
    return{
      bookList: null, // ##数据列表
      bookQuery: {},// ##查询条件封装对象
      total: 0, // ## 总计路数
      pageNo: 1, // ##页码
      pageSize: 5,// ## 每页显示记录数
      currentTime: '' ,// ##当前时间
      firstCategoryList: [],
      secondCategoryList: []
    }
  },
  created(){ // ##页面尚未渲染之前执行的方法，data与methods已经被加载
    this.pageBook()
    this.getFirstCategoryList()
    },
  methods:{
    // ## 查询数据列表
    pageBook(pageNo = 1){
      this.pageNo=pageNo
      book.pageBook(this.pageNo,this.pageSize,this.bookQuery)
        .then(response =>{
          // ## 赋值
          this.bookList=response.data.items
          this.total=response.data.total
          this.currentTime = this.format(new Date(),'yyyy-MM-dd HH:mm:ss')
      })
    },
    format(date, fmt) { // ## 格式化日期
      let o = {
        'M+': date.getMonth() + 1, // ## 月份
        'd+': date.getDate(), // ## 日
        'H+': date.getHours(), // ## 小时
        'm+': date.getMinutes(), // ## 分
        's+': date.getSeconds(), // ## 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // ## 季度
        'S': date.getMilliseconds() // ## 毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (let k in o)
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      return fmt
    },
    reset(){ // ## 清空查询条件
      // ## 清空查询条件的内容
      this.bookQuery={}
      // ## 重新查询
      this.pageBook()
    },
    deleteBook(bookId,isOnline){// ##删除书籍信息
      if(isOnline ===1){
        // ## 提示消息
        this.$message({
          type: 'error',
          message: '已上线，无法删除'
        })
        return
      }
      this.$confirm('此操作将永久删除该记录，是否继续?','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        book.deleteBook(bookId)
          .then(response =>{
            // ##提示消息
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            // ## 重新查询
            this.pageBook()
          })
      })
      .catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    upOrDownBook(bookId, isOnline) {// ##上架或下架书籍
      this.$confirm('是否修改书籍上架下架状态，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        book.upOrDownBook(bookId,isOnline)
        .then(response =>{
          this.$message({
            type: 'success',
            message: '状态已改变'
          })
          // ## 重新查询
          this.pageBook()
        })
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '状态改变失败'
        })
      })
    },
    getFirstCategoryList(){// ## 获取一级分类
      category.getCategoryList()
        .then(response =>{
          this.firstCategoryList=response.data.items
        })
    },
    formatFirst(row){// ## 一级分类显示
      for (let i = 0; i < this.firstCategoryList.length; i++) {
        if(row.level1Id === this.firstCategoryList[i].id){
          return this.firstCategoryList[i].name
        }
      }
      return this.firstCategoryList
    },
    formatSecond(row){// ## 二级分类显示
      // ## row 表示当前这一行的数据
      for (let i = 0; i < this.firstCategoryList.length; i++) {
        if(row.level1Id===this.firstCategoryList[i].id){
          for (let j = 0; j < this.firstCategoryList[i].secondCategoryList.length; j++) {
            if(row.level2Id===this.firstCategoryList[i].secondCategoryList[j].id){
              return  this.firstCategoryList[i].secondCategoryList[j].name
            }
          }
        }

      }

    }
  }
}
</script>
