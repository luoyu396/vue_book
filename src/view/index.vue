<template>
  <div>
    <v-header
      :user="userInfo"
      :isSuper="isSuper"
    />
    <div class="body">
      <v-nav :menus="menuList" />
      <div class="inner-content content">
        <router-view class="body-content" />
      </div>
    </div>

    <el-dialog
      title="修改密码"
      :visible.sync="userPassDialogVisible"
      width="550px"
      @close="handleClose('userPassFormData')"
    >
      <el-form :model="userPassFormData" ref="userPassFormData" :rules="rules">
        <el-form-item label="原始密码:" :label-width="formLabelWidth" prop="oldPassword">
          <el-input
            v-model="userPassFormData.oldPassword"
            autocomplete="off"
            show-password
            style="width: 300px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码:" :label-width="formLabelWidth" prop="newPassword">
          <el-input
            v-model="userPassFormData.newPassword"
            autocomplete="off"
            show-password
            style="width: 300px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" :label-width="formLabelWidth" prop="confirmPassword">
          <el-input
            v-model="userPassFormData.confirmPassword"
            autocomplete="off"
            show-password
            style="width: 300px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updatePassword('userPassFormData')" :loading="loading">保存</el-button>
        <el-button @click="userPassDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="基本信息"
      :visible.sync="userDialogVisible"
      width="550px"
      @close="handleClose('userFormData')"
    >
      <el-form :model="userFormData" ref="userFormData" :rules="rules">
        <el-form-item label="登录名:" :label-width="formLabelWidth" prop="loginName">
          <el-input v-model="userFormData.loginName" autocomplete="off" style="width: 300px;" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名:" :label-width="formLabelWidth" prop="userName">
          <el-input v-model="userFormData.userName" autocomplete="off" style="width: 300px;"></el-input>
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
        <el-button type="primary" @click="updateUser('userFormData')" :loading="loading">保存</el-button>
        <el-button @click="userDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import Header from "../components/header";
import Nav from "../components/nav.vue";
import { mapState } from "vuex";

export default {
  data() {
    let oldValid = (rule,value,callback)=>{
      let _this = this;
      if(_this.userInfo.password != _this.$md5(value)) {
          callback(new Error('原始密码错误'));
      }else {
        callback();
      }
    }
    let newValid = (rule,value,callback)=>{
      let _this = this;
      if(_this.userPassFormData.confirmPassword != "") {
          if(_this.userPassFormData.confirmPassword != _this.userPassFormData.newPassword) {
            callback(new Error('新密码与确认密码错误'));
          }
          else {
            callback();
          }
      }else {
        callback();
      }
    }
    let confirmValid = (rule,value,callback)=>{
      let _this = this;
      if(_this.userPassFormData.newPassword != "") {
          if(_this.userPassFormData.confirmPassword != _this.userPassFormData.newPassword) {
            callback(new Error('新密码与确认密码错误'));
          }
          else {
            callback();
          }
      }else {
        callback();
      }
    }
    return {
      //退出
      logoutUrl: this.$url + "adminLogin/logout",
      //更新URL
      updateUrl: this.$url + "user/update",
      //更新密码
      updatePasswordUrl: this.$url + "user/updatePassword",
      //更新当前会话用户信息
      updateSessionUserUrl: this.$url + "user/updateSessionUser",
      loading: false,
      //用户信息
      userInfo: {},
      //菜单集合
      menuList: [],
      //修改密码
      userPassDialogVisible: false,
      formLabelWidth: "120px",
      //规则
      rules: {
        oldPassword: [
          { required: true, message: "请输入原始密码", trigger: "blur" },
          { validator: oldValid, trigger:'blur'}
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { validator: newValid, trigger:'blur'}
        ],
        confirmPassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          { validator: confirmValid, trigger:'blur'}
        ],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ]
      },
      //修改密码表单
      userPassFormData: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      },
      //基本信息弹框
      userDialogVisible: false,
      userFormData: {}
    };
  },
  components: {
    "v-header": Header,
    "v-nav": Nav
  },
  computed: {
    ...mapState({
      sysData(state) {
        return state;
      }
    }),
    ...mapState(["isSuper"])
  },
  methods: {
    //获取用户信息
    getUser() {
      let _this = this;
      if(_this.sysData){
          _this.userInfo = Object.assign({}, _this.sysData);
          //初始化菜单
          _this.initMenu();
      } else {
        _this.$message.error("登录会话过期");
        //跳转到登录
        _this.$router.push({
          name: "login"
        });
      }
    },
    handleCommand(command) {
      var _this = this;
      //退出
      if (command == "logout") {
        _this.$ajax.get(_this.logoutUrl).then(res => {
          if (res.data.code == 200) {
            _this.$message({
              message: "退出成功",
              type: "success",
              duration: 1000,
              onClose: function() {
                //跳转到登录
                _this.$router.push({
                  name: "login"
                });
              }
            });
          }
        });
      }
      //基本信息
      if(command == "updateUserInfo") {
        _this.userFormData = _this.userInfo;
        _this.userDialogVisible = true;
      }
      //修改密码
      if(command == "updatePwd") {
        _this.userPassDialogVisible = true;
      }
    },
    //初始化菜单
    initMenu() {
      if (this.isSuper) {
        this.menuList.push({
          menuId: "user_list",
          menuName: "用户管理"
        });
      }
      this.menuList.push({
        menuId: "type_list",
        menuName: "分类管理"
      },{
        menuId: "book_list",
        menuName: "图书管理"
      },{
        menuId: "order_info_list",
        menuName: "订单管理"
      },{
        menuId: "statistics_list",
        menuName: "统计管理"
      });
    },
    //关闭弹框
    handleClose(formName) {
      this.resetForm(formName);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //修改密码
    updatePassword(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.loading = true;
          let params = new URLSearchParams();
          params.append("userId", _this.userInfo.userId);
          params.append("password", _this.$md5(_this.userPassFormData.newPassword));
          params.append("contentType", 1);
          _this.$ajax.put(_this.updatePasswordUrl, params).then(res => {
            res = res.data;
            _this.loading = false;
            if (res.code == 200) {
              //更新当前会话用户信息
              _this.updateSessionUser(_this.userInfo.userId);
              _this.$message({
                message: "更新成功",
                type: "success"
              });
              _this.userPassDialogVisible = false;
            } else {
              _this.$message({
                message: res.msg,
                type: "error"
              });
            }
          });
        }
      });
    },
    //修改信息
    updateUser(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.loading = true;
          _this.$ajax.put(_this.updateUrl, _this.userFormData).then(res => {
            res = res.data;
            _this.loading = false;
            if (res.code == 200) {
              //更新当前会话用户信息
              _this.updateSessionUser(_this.userFormData.userId);
              _this.$message({
                message: "更新成功",
                type: "success"
              });
              _this.userDialogVisible = false;
            } else {
              _this.$message({
                message: res.msg,
                type: "error"
              });
            }
          });
        }
      });
    },
    //更新当前会话用户信息
    updateSessionUser(userId) {
      let _this = this;
      _this.$ajax.get(_this.updateSessionUserUrl+"/"+userId).then(res => {
        if (res.data.code == 200) {
          _this.userInfo = res.data.data;
          _this.$store.commit("setSysData",_this.userInfo);
        }
      });
    }
  },
  mounted: function() {
    //获取用户信息
    this.getUser();
  },
  provide() {
    return {
      handleCommand: this.handleCommand
    };
  }
};
</script>

