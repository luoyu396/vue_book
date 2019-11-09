<!-- 图书管理 -->
<template>
  <div>
    <div class="ui-option">
      <div class="option-left">
        <div class="option-item">
          <el-button
            size="small"
            class="operation"
            type="primary"
            @click="addBook"
            icon="el-icon-plus"
          >新增</el-button>
        </div>
      </div>
      <div class="option-right">
        <div class="option-item">
          <el-form :inline="true">
            <el-form-item label="分类">
              <select-tree ref="selectTree"
                class="stree"
                :props="props"
                :options="treeNodeList"
                :clearable="isClearable"
                :accordion="isAccordion"
                @getvalue="getvalue($event)"
              ></select-tree>
            </el-form-item>
            <el-form-item label="图书名称">
              <el-input size="small" v-model="searchParams.bookName" placeholder="图书名称"></el-input>
            </el-form-item>
            <el-form-item label="ISBN">
              <el-input size="small" v-model="searchParams.isbn" placeholder="ISBN"></el-input>
            </el-form-item>
            <el-form-item label="出版社">
              <el-input size="small" v-model="searchParams.publisher" placeholder="出版社"></el-input>
            </el-form-item>
            <el-form-item label="作者">
              <el-input size="small" v-model="searchParams.author" placeholder="作者"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="search-btn" size="small" type="primary" @click="onSearch">检索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <el-table :data="bookList" stripe border style="width: 100%;">
      <el-table-column label="序号" align="center" type="index" width="50"></el-table-column>
      <el-table-column prop="bookName" label="图书名称" align="center" min-width="200"></el-table-column>
      <el-table-column prop="isbn" label="ISBN" align="center" min-width="200"></el-table-column>
      <el-table-column prop="publisher" label="出版社" align="center" min-width="200"></el-table-column>
      <el-table-column prop="author" label="作者" align="center" min-width="200"></el-table-column>
      <el-table-column prop="typeName" label="分类" align="center" min-width="200"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            class="icon_size"
            type="text"
            title="编辑"
            @click="toEdit(scope.row)"
          ></el-button>
          <el-button
            icon="el-icon-delete"
            class="icon_size"
            type="text"
            title="删除"
            @click="toDelete(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="table_page" v-show="showPageFlag">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="pageSize"
        background
        layout="prev, jumper, pager, next, sizes, total"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog
      :title="bookTitle"
      :visible.sync="bookDialogVisible"
      width="850px"
      @close="handleClose('bookFormData')"
    >
      <el-form :model="bookFormData" ref="bookFormData" :inline="true" :rules="rules" class="book_info_form">
        <el-form-item label="分类:" :label-width="formLabelWidth" prop="typeId">
          <select-tree ref="typeIdTree"
                class="input_item"
                :props="props"
                :options="treeNodeList"
                :value="bookFormData.typeId"
                :clearable="isClearable"
                :accordion="isAccordion"
                @getvalue="getFormvalue($event)"
              ></select-tree>
        </el-form-item>
        <el-form-item label="图书名称:" :label-width="formLabelWidth" prop="bookName">
          <el-input v-model="bookFormData.bookName" class="input_item" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="ISBN:" :label-width="formLabelWidth" prop="isbn">
          <el-input v-model="bookFormData.isbn" class="input_item" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出版社:" :label-width="formLabelWidth" prop="publisher">
          <el-input v-model="bookFormData.publisher" class="input_item" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="作者:" :label-width="formLabelWidth" prop="author">
          <el-input v-model="bookFormData.author" class="input_item" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="页数:" :label-width="formLabelWidth" prop="pageNum">
          <el-input v-model="bookFormData.pageNum" class="input_item" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出版时间:" :label-width="formLabelWidth" prop="publishDate">
          <el-date-picker
            class="input_item"
            v-model="bookFormData.publishDate"
            type="date"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="销售价格:" :label-width="formLabelWidth" prop="salePrice">
          <el-input v-model="bookFormData.salePrice" class="input_item" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="折扣率:" :label-width="formLabelWidth" prop="discount">
          <el-input v-model="bookFormData.discount" class="input_item" autocomplete="off"></el-input>
        </el-form-item>
        <div>
          <el-form-item label="图书简介:" :label-width="formLabelWidth" prop="introduction">
              <el-input type="textarea" v-model="bookFormData.introduction" class="input_area_item" rows="6"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="图片:" :label-width="formLabelWidth" prop="imgId" class="form_item_img">
              <img-attach :attach="imgAttach" :on-uploaded="onUploaded" :view="isView"/>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveOrbook('bookFormData')" :loading="loading">保存</el-button>
        <el-button @click="bookDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import treeSelect from "@/components/tree-select.vue";
import imgAttach from "@/components/imgAttach.vue"; 

export default {
  components: {
    "select-tree": treeSelect,
    "img-attach": imgAttach
  },
  data: function() {
    return {
      //查询列表URL
      initListUrl: this.$url + "book/queryListPage2",
      //树形节点URL
      treeNodeUrl: this.$url + "type/treeNodes",
      //保存URL
      saveUrl: this.$url + "book/save",
      //更新URL
      updateUrl: this.$url + "book/update",
      //删除URL
      deleteUrl: this.$url + "book/delete",
      //获取图片附件
      imageUrl: this.$url + "image/selectOne",
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 1,
      //宽度
      formLabelWidth: "150px",
      //树形节点集合
      treeNodeList: [],
      // 可清空（可选）
      isClearable: true,
      // 可收起（可选）
      isAccordion: true,
      // 配置项（必选）
      props: {
        value: "id",
        label: "label",
        children: "children"
      },
      //查询参数
      searchParams: {
        typeId: "",
        bookName: "",
        isbn: "",
        publisher: "",
        author: ""
      },
      //列表数据
      bookList: [],
      //表单
      bookFormData: {
        bookId: "",
        typeId: "",
        bookName: "",
        isbn: "",
        publisher: "",
        author: "",
        pageNum: "",
        publishDate: "",
        salePrice: "",
        introduction: "",
        discount: "",
        buyCount: 0,
        imgId: "",
        createTime: new Date()
      },
      //规则
      rules: {
        typeId: [
          { required: true, message: "请选择分类", trigger: "change" }
        ],
        bookName: [
          { required: true, message: "请输入图书名称", trigger: "blur" }
        ],
        isbn: [
          { required: true, message: "请输入ISBN", trigger: "blur" }
        ],
        publisher: [
          { required: true, message: "请输入出版社", trigger: "blur" }
        ],
        author: [
          { required: true, message: "请输入作者", trigger: "blur" }
        ],
        pageNum: [
          { required: true, message: "请输入页数", trigger: "blur" }
        ],
        publishDate: [
          { required: true, message: "请输入出版时间", trigger: "blur" }
        ],
        salePrice: [
          { required: true, message: "请输入销售价格", trigger: "blur" }
        ],
        introduction: [
          { required: true, message: "请输入图书简介", trigger: "blur" }
        ],
        discount: [
          { required: true, message: "请输入折扣率", trigger: "blur" }
        ],
      },
      //弹框
      bookDialogVisible: false,
      //表单名
      bookTitle: "",
      //只读
      isView: false,
      //图片
      imgAttach: {
        url: ''
      }
    };
  },
  methods: {
    //获取分类树形节点集合
    getTreeNodeList() {
      let _this = this;
      _this.$ajax.get(_this.treeNodeUrl).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.treeNodeList = res.data;
        }else {
          _this.treeNodeList = [];
          _this.$message({
            message: "列表初始化失败",
            type: "error"
          });
        }
      });
    },
    // 下拉切换 取值
    getvalue(value){
      this.searchParams.typeId = value == null ? "" : value;
    },
    getFormvalue(value){
      this.bookFormData.typeId = value;
    },
    //查询
    onSearch() {
      this.currentPage = 1;
      this.initList();
    },
    //初始化列表
    initList() {
      var _this = this;
      let params = new URLSearchParams();
      params.append("page", _this.currentPage);
      params.append("rows", _this.pageSize);
      params.append("typeId", _this.searchParams.typeId);
      params.append("bookName", _this.searchParams.bookName);
      params.append("isbn", _this.searchParams.isbn);
      params.append("publisher", _this.searchParams.publisher);
      params.append("author", _this.searchParams.author);
      params.append("contentType", 1);
      _this.$ajax.post(_this.initListUrl, params).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.bookList = res.data.list;
          _this.total = res.data.total;
          _this.currentPage = res.data.pageNum;
          _this.pageSize = res.data.pageSize;
        } else {
          _this.bookList = [];
          _this.$message({
            message: "列表初始化失败",
            type: "error"
          });
        }
      });
    },
    //创建实例
    getInstance() {
      return {
        bookId: "",
        typeId: "",
        bookName: "",
        isbn: "",
        publisher: "",
        author: "",
        pageNum: "",
        publishDate: "",
        salePrice: "",
        introduction: "",
        discount: "",
        buyCount: 0,
        imgId: "",
        createTime: new Date()
      }
    },
    //添加图书
    addBook() {
      let _this = this;
      _this.bookTitle = "添加图书";
      _this.loading = false;
      _this.imgAttach.url = "";
      _this.bookFormData = _this.getInstance();
      //下拉树
      var trees = _this.$refs['typeIdTree'];
      for(var x in trees){
        try{
          trees[x].clearHandle(); 
        }catch(e){}
      }
      setTimeout(function(){
        _this.$refs["bookFormData"].clearValidate();
      },100);
      _this.bookDialogVisible = true;
    },
    //编辑图书
    toEdit(row) {
      this.bookTitle = "修改图书";
      this.loading = false;
      this.bookFormData = Object.assign({}, row);
      if(row.imgId != null && row.imgId != "") {
        //获取图片
        this.getImage(row.imgId);
      }
      else {
        this.imgAttach.url = "";
        this.bookDialogVisible = true;
      }
    },
    //获取图片
    getImage(imgId){
      let _this = this;
      _this.$ajax.get(_this.imageUrl+"/"+imgId).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.imgAttach.url = this.$imgUrl+res.data.downloadUrl;
        }else {
          _this.$message({
            message: "获取图片失败",
            type: "error"
          });
        }
        _this.bookDialogVisible = true;
      });
    },
    //上传完回调
    onUploaded(attach){
      this.bookFormData.imgId = attach.imgId;
    },
    //删除图书
    toDelete(row) {
      var _this = this;
      _this
        .$confirm("确认删除记录吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          //执行删除操作
          _this.$ajax.delete(_this.deleteUrl + "/" + row.bookId).then(res => {
            res = res.data;
            if (res.code == 200) {
              _this.$message({
                message: "删除成功",
                type: "success"
              });
              _this.initList();
            } else {
              _this.$message({
                message: res.msg,
                type: "error"
              });
            }
          });
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.initList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initList();
    },
    //关闭弹框
    handleClose(formName) {
      this.resetForm(formName);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //保存或更新图书
    saveOrbook(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.loading = true;
          if (_this.bookFormData.bookId == "") {
            _this.$ajax.post(_this.saveUrl, _this.bookFormData).then(res => {
              res = res.data;
              _this.loading = false;
              if (res.code == 200) {
                _this.$message({
                  message: "保存成功",
                  type: "success"
                });
                _this.bookDialogVisible = false;
                _this.initList();
              } else {
                _this.$message({
                  message: res.msg,
                  type: "error"
                });
              }
            });
          } else {
            _this.$ajax.put(_this.updateUrl, _this.bookFormData).then(res => {
              res = res.data;
              _this.loading = false;
              if (res.code == 200) {
                _this.$message({
                  message: "更新成功",
                  type: "success"
                });
                _this.bookDialogVisible = false;
                _this.initList();
              } else {
                _this.$message({
                  message: res.msg,
                  type: "error"
                });
              }
            });
          }
        }
      });
    }
  },
  computed: {
    showPageFlag: function() {
      return this.bookList.length > 0;
    }
  },
  mounted() {
    //获取分类树形节点集合
    this.getTreeNodeList();
    this.initList();
  }
};
</script>
<style lang="scss">
    .book_info_form {
        .el-form-item__content {
          width: 200px !important;
        }
        .el-form-item__label{
            line-height: 20px;
            padding-top:10px;
        }
        .form_item_custom{
            .el-form-item__label{
                padding-top: 0px;
            }
        }
        .form_item_img{
            .el-form-item__label::before{
                content: '*';
                color:#f56c6c;
                margin-right:4px;
            }
        }
        .input_area_item{
            width:555px;
        }
    }
    .stree .el-input__inner {
      height: 28px !important;
      line-height: 28px !important;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 200px;
    }
</style>