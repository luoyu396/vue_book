<!-- 用户管理 -->
<template>
  <div>
    <div class="ui-option">
      <div class="option-left">
        <div class="option-item">
          <el-button
            size="small"
            class="operation"
            type="primary"
            @click="addUser"
            icon="el-icon-plus"
          >新增用户</el-button>
        </div>
      </div>
      <div class="option-right">
        <div class="option-item">
          <el-form :inline="true">
            <el-form-item label="登录名">
              <el-input size="small" v-model="searchParams.loginName" placeholder="登录名" clearable></el-input>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input size="small" v-model="searchParams.userName" placeholder="用户名" clearable></el-input>
            </el-form-item>
            <el-form-item label="用户类型">
              <el-select
                placeholder="请选择用户类型"
                size="small"
                class="el-mini"
                v-model="searchParams.userType"
                clearable
              >
                <el-option label="普通用户" value="1"></el-option>
                <el-option label="管理员" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="移动电话">
              <el-input size="small" v-model="searchParams.telphone" placeholder="移动电话" clearable></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input size="small" v-model="searchParams.email" placeholder="邮箱" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="search-btn" size="small" type="primary" @click="onSearch">检索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <el-table :data="userList" stripe border style="width: 100%;">
      <el-table-column label="序号" align="center" type="index" width="50"></el-table-column>
      <el-table-column prop="loginName" label="登录名" align="center" min-width="200"></el-table-column>
      <el-table-column prop="userName" label="用户名" align="center" min-width="200"></el-table-column>
      <el-table-column prop="userType" label="用户类型" align="center" min-width="200">
        <template slot-scope="scope">{{scope.row.userType == '1'? '普通用户' : '管理员'}}</template>
      </el-table-column>
      <el-table-column prop="telphone" label="移动电话" align="center" min-width="200"></el-table-column>
      <el-table-column prop="email" label="邮箱" align="center" min-width="200"></el-table-column>
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
          <el-button
            icon="el-icon-setting"
            class="icon_size"
            type="text"
            title="设置密码"
            @click="toSetPassword(scope.row)"
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
      :title="userTitle"
      :visible.sync="userDialogVisible"
      width="550px"
      @close="handleClose('userFormData')"
    >
      <el-form :model="userFormData" ref="userFormData" :rules="rules">
        <el-form-item label="登录名:" :label-width="formLabelWidth" prop="loginName">
          <el-input v-model="userFormData.loginName" autocomplete="off" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="用户名:" :label-width="formLabelWidth" prop="userName">
          <el-input v-model="userFormData.userName" autocomplete="off" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="用户类型:" :label-width="formLabelWidth" prop="userType">
          <el-select
            placeholder="请选择用户类型"
            size="small"
            class="el-mini"
            v-model="userFormData.userType"
            style="width: 300px;"
            :disabled="userFormData.userId != ''"
          >
            <el-option label="普通用户" value="1"></el-option>
            <el-option label="管理员" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="userFormData.userId == ''"
          label="密码:"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-input
            v-model="userFormData.password"
            autocomplete="off"
            show-password
            style="width: 300px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="移动电话:" :label-width="formLabelWidth" prop="telphone">
          <el-input v-model="userFormData.telphone" autocomplete="off" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" :label-width="formLabelWidth" prop="email">
          <el-input v-model="userFormData.email" autocomplete="off" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="地址:" :label-width="formLabelWidth" prop="address">
          <el-input v-model="userFormData.address" autocomplete="off" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="备注:" :label-width="formLabelWidth" prop="remark">
          <el-input
            type="textarea"
            v-model="userFormData.remark"
            autocomplete="off"
            style="width: 300px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveOrUser('userFormData')" :loading="loading">保存</el-button>
        <el-button @click="userDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="修改密码"
      :visible.sync="userPassDialogVisible"
      width="550px"
      @close="handleClose('userFormData')"
    >
      <el-form :model="userFormData" ref="userFormData" :rules="rules">
        <el-form-item label="密码:" :label-width="formLabelWidth" prop="password">
          <el-input
            v-model="userFormData.password"
            autocomplete="off"
            show-password
            style="width: 300px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updatePassword('userFormData')" :loading="loading">保存</el-button>
        <el-button @click="userPassDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      //查询列表URL
      initListUrl: this.$url + "user/queryListPage2",
      //保存URL
      saveUrl: this.$url + "user/save",
      //更新URL
      updateUrl: this.$url + "user/update",
      //删除URL
      deleteUrl: this.$url + "user/delete",
      //更新密码
      updatePasswordUrl: this.$url + "user/updatePassword",
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 1,
      //宽度
      formLabelWidth: "150px",
      //查询参数
      searchParams: {
        loginName: "",
        userName: "",
        userType: "",
        telphone: "",
        email: ""
      },
      //列表数据
      userList: [],
      //表单
      userFormData: {
        userId: "",
        loginName: "",
        userName: "",
        userType: "1",
        password: "",
        telphone: "",
        email: "",
        address: "",
        createTime: new Date(),
        remark: ""
      },
      //规则
      rules: {
        loginName: [
          { required: true, message: "请输入登录名", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        userType: [
          { required: true, message: "请选择用户类型", trigger: "change" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      //弹框
      userDialogVisible: false,
      //表单名
      userTitle: "",
      //修改密码
      userPassDialogVisible: false
    };
  },
  methods: {
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
      params.append("loginName", _this.searchParams.loginName);
      params.append("userName", _this.searchParams.userName);
      params.append("userType", _this.searchParams.userType);
      params.append("telphone", _this.searchParams.telphone);
      params.append("email", _this.searchParams.email);
      params.append("contentType", 1);
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
    //创建实例
    getInstance() {
        return {
          userId: "",
          loginName: "",
          userName: "",
          userType: "1",
          password: "",
          telphone: "",
          email: "",
          address: "",
          createTime: new Date(),
          remark: ""
        }
    },
    //添加用户
    addUser() {
      this.userTitle = "添加用户";
      this.loading = false;
      this.userFormData = this.getInstance();
      this.userDialogVisible = true;
    },
    //编辑用户
    toEdit(row) {
      this.userTitle = "修改用户";
      this.loading = false;
      this.userFormData = Object.assign({}, row);
      this.userDialogVisible = true;
    },
    //删除用户
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
          _this.$ajax.delete(_this.deleteUrl + "/" + row.userId).then(res => {
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
    //保存或更新用户
    saveOrUser(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.loading = true;
          if (_this.userFormData.userId == "") {
            _this.userFormData.password = _this.$md5(
              _this.userFormData.password
            );
            _this.$ajax.post(_this.saveUrl, _this.userFormData).then(res => {
              res = res.data;
              _this.loading = false;
              if (res.code == 200) {
                _this.$message({
                  message: "保存成功",
                  type: "success"
                });
                _this.userDialogVisible = false;
                _this.initList();
              } else {
                _this.userFormData.password = "";
                _this.$message({
                  message: res.msg,
                  type: "error"
                });
              }
            });
          } else {
            _this.$ajax.put(_this.updateUrl, _this.userFormData).then(res => {
              res = res.data;
              _this.loading = false;
              if (res.code == 200) {
                _this.$message({
                  message: "更新成功",
                  type: "success"
                });
                _this.userDialogVisible = false;
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
    },
    //设置密码
    toSetPassword(row) {
      this.loading = false;
      this.userFormData.userId = row.userId;
      this.userFormData.password = "";
      this.userPassDialogVisible = true;
    },
    //更新密码
    updatePassword(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.loading = true;
          let params = new URLSearchParams();
          params.append("userId", _this.userFormData.userId);
          params.append("password", _this.$md5(_this.userFormData.password));
          params.append("contentType", 1);
          _this.$ajax.put(_this.updatePasswordUrl, params).then(res => {
            res = res.data;
            _this.loading = false;
            if (res.code == 200) {
              _this.$message({
                message: "更新成功",
                type: "success"
              });
              _this.userPassDialogVisible = false;
              _this.initList();
            } else {
              _this.$message({
                message: res.msg,
                type: "error"
              });
            }
          });
        }
      });
    }
  },
  computed: {
    showPageFlag: function() {
      return this.userList.length > 0;
    }
  },
  mounted() {
    this.initList();
  }
};
</script>