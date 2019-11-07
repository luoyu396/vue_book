<!-- 用户管理 -->
<template>
    <div>
        <div class="ui-option">
          <div class="option-left">
              <div class="option-item">
                <el-button size="small" class="operation" type="primary" @click="addUser" icon="el-icon-plus">新增</el-button>
              </div>  
          </div>
          <div class="option-right">
              <div class="option-item">
                <el-form :inline="true">
                    <el-form-item>
                      <el-button class="search-btn" size="small" type="primary">检索</el-button>
                    </el-form-item>
                </el-form>
              </div>  
          </div>
        </div>

        <el-table :data="userList" stripe border style="width: 100%;">
          <el-table-column label="序号" align="center" type="index" width="50"></el-table-column>
          <el-table-column prop="loginName" label="登录名" align="center" min-width="200"></el-table-column>
          <el-table-column prop="userName" label="用户名" align="center" min-width="200"></el-table-column>
          <el-table-column label="操作" width="150" align="center">
              <!-- <template  slot-scope="scope">
                <el-button
                    icon="el-icon-edit"
                    class="icon_size"
                    type="text"
                    title="编辑"
                ></el-button>
                <el-button
                    icon="el-icon-delete"
                    class="icon_size"
                    type="text"
                    title="删除"
                ></el-button>
              </template> -->
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

    </div>
</template>

<script>
export default {
    data: function() {
      return {
        //查询列表URL
        initListUrl: this.$url + "user/queryListPage2",
        loading: false,
        currentPage: 1,
        pageSize: 10,
        total: 1,
        //列表数据
        userList: [],
      }
    },
    methods: {
      initList() {
        var _this = this;
        let params = new URLSearchParams();
        params.append("page",_this.currentPage);
        params.append("rows",_this.pageSize);
        params.append("contentType", 1)
        _this.$ajax.post(_this.initListUrl, params).then(res => {
          res = res.data;
          if (res.code == 200) {
            _this.userList = res.data.list;
            _this.total = res.data.total;
            _this.currentPage = res.data.pageNum;
            _this.pageSize = res.data.pageSize;
          } else {
            _this.userList = [];
            _this.$message({
              message: "列表初始化失败",
              type: "error"
            });
          }
        });
      },
      //添加用户
      addUser() {

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
    },
    computed: {
      showPageFlag: function() {
        return this.userList.length > 0;
      }
    },
    mounted() {
      this.initList();
    }
}
</script>