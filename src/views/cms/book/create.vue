<template>
  <div id="app-container">
<!--  书籍增加-->
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
      <el-form-item label="一级分类">
        <el-select @change="getSecondCategoryList" v-model="book.level1Id" placeholder="请选择">
          <el-option
            v-for="item in firstCategoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="book.level2Id" placeholder="请选择">
          <el-option
            v-for="item in secondCategoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
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
      <!--书封-->
      <el-form-item label="书封">
        <el-upload
          class="avatar-uploder"
          :action="BASE_API + '/oss/uploadFile'"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="book.bookCover" :src="book.bookCover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveBook()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import book from '@/api/cms/book'
import category from "@/api/cms/category";

export default {
  data(){
    return{
      book: {
        bookName: '',
        author: '',
        level1Id: '',
        level2Id: '',
        grantStartTime: '',
        grantEndTime: '',
        isSerialize: '',
        isCharge: '',
        isOriginal: '',
        introduction: '',
        bookCover: '',
      },
      saveBtnDisabeled: false,// ##不禁用保存按钮
      BASE_API: process.env.VUE_APP_BASE_API, // ##后端服务地址
      firstCategoryList: [], // ##一级分类列表
      secondCategoryList: [] // ##二级分类列表
    }
  },
  created(){
    this.getFirstCategoryList()
  },
  methods:{
    saveBook(){
      // ##禁用按钮
      this.saveBtnDisabeled = true
      book.saveBook(this.book)
        .then(response =>{
        // this.saveBtnDisabeled=false
        // ##提示消息
        this.$message({
          type: 'success',
          message: '保存成功！'
        })
        // ##跳转至list页面
        this.$router.push('/cms/book/list')
      })
    },
    handleAvatarSuccess(res,file){
      this.book.bookCover = res.data.uploadUrl
    },
    beforeAvatarUpload(file){
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size /1024/1024<2;

      if(!isJPG){
        this.$message.error('上传图片只能是JPG格式文件')
      }
      if(!isLt2M){
        this.$message.error('上传图片大小不能超过2M')
      }
      return isJPG && isLt2M
    },
    getFirstCategoryList(){// ## 获取一级分类list
      category.getCategoryList()
        .then(response =>{
          this.firstCategoryList=response.data.items
        })

    },
    getSecondCategoryList(value){// ##获取二级分类list
      // ## 清空
      this.book.level2Id=''
      for (let i = 0; i < this.firstCategoryList.length; i++) {
        console.log(value)
        if(value === this.firstCategoryList[i].id){
          this.secondCategoryList= this.firstCategoryList[i].secondCategoryList
        }
      }
    }
    // ##
  }
}
</script>

<style>
  .avatar-uploader .el-upload{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload{
    border-color: #409EFF;
  }
  .avatar-uploader-icon{
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar{
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
