<template>
  <div id="app-container">
    <!--  书籍修改-->
    <el-form label-width="130px">
      <el-form-item label="书名">
        <el-col :span="5">
          <el-input v-model="book.bookName"/>
        </el-col>
      </el-form-item>
      <el-form-item label="作者">
        <el-col :span="5">
          <el-input v-model="book.author"/>
        </el-col>
      </el-form-item>
      <!--      分类-->
      <!--      版权-->
      <el-form-item label="授权开始时间">
        <el-date-picker
          v-model="book.grantStartTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item label="授权结束时间">
        <el-date-picker
          v-model="book.grantEndTime"
          type="datetime"
          placeholder="选择结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item label="连载">
        <el-select v-model="book.isSerialize" clearable placeholder="请选择">
          <el-option :value="1" label="是"/>
          <el-option :value="0" label="否"/>
        </el-select>
      </el-form-item>
      <el-form-item label="全本收费">
        <el-select v-model="book.isCharge" clearable placeholder="请选择">
          <el-option :value="1" label="是"/>
          <el-option :value="0" label="否"/>
        </el-select>
      </el-form-item>
      <el-form-item label="原创">
        <el-select v-model="book.isOriginal" clearable placeholder="请选择">
          <el-option :value="1" label="是"/>
          <el-option :value="0" label="否"/>
        </el-select>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="book.introduction" :row="5" type="textarea"/>
      </el-form-item>
      <!--            书封-->
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="updateBook()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import book from '@/api/cms/book'
export default {
  data(){
    return {
      book:{},
      saveBtnDisabeled: false,// ## 不禁用保存按钮
      BASE_API: process.env.VUE_APP_BASE_API

    }
  },
  created(){
    this.init()
  },
  methods: {
    init(){
      if(this.$route.params && this.$route.params.id){
        const bookId=this.$route.params.id
        this.view(bookId)
        console.log(bookId)
      }
    },
    view(bookId){ // ## 根据ID收集数据
      book.view(bookId)
      .then(response =>{
        // ## 赋值
        this.book =response.data.book
      })
    },
    updateBook() { // ## 修改书籍
      this.saveBtnDisabled = true // ##禁用保存按钮
      book.updateBook(this.book)
        .then(response => {
          // ## 提示信息
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          // ## 回到list页面,重定向功能
          this.$router.push('/cms/book/list')
        })
    }
  }
}
</script>
