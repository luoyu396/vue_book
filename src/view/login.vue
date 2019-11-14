<!--管理员登录页面-->
<template>
  <div class="login">
    <div class="login-body">
      <div class="wrap">
        <div class="logo">
          <p class="title">网络图书交易系统</p>
          <p class="desc">后台管理系统</p>
        </div>
        <div class="login-form">
          <p class="login-title">
            账号登录
          </p>
          <!-- 账号密码登录 -->
          <p class="login-name">
            <input id="username" v-model="loginModel.username" type="text" placeholder="用户名">
            <label class="el-icon-personnel" for="username"></label>
          </p>
          <p class="login-password">
            <input
              id="password"
              v-model="loginModel.password"
              @keyup.enter="toLogin"
              type="password"
              placeholder="密码"
            >
            <label class="el-icon-lock" for="password"></label>
          </p>
          <p class="login-submit">
            <el-button type="primary" @click="toLogin" size="large" class="login-btn">立即登录</el-button>
          </p>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  export default {
    mounted: function () {
    },
    data: function () {
      return {
        loginUrl: this.$url + 'adminLogin/login',
        //当前用户
        currentUserUrl: this.$url + "user/currentUser",
        loginModel: {
          username: "",
          password: ""
        },
      };
    },
    methods: {
      //登录
      toLogin() {
        let _this = this;
        let username = _this.loginModel.username;
        let password = _this.loginModel.password;
        if (!username) {
          _this.$message({
            message: "用户名不能为空",
            iconClass: "el-icon-circle-cross1"
          });
          return;
        }
        if (!password) {
          _this.$message({
            message: "密码不能为空",
            iconClass: "el-icon-circle-cross1"
          });
          return;
        }
        password = _this.$md5(password);
        let params = new URLSearchParams();
        params.append("loginName",username);
        params.append("password",password);
        params.append("contentType", 1)
        _this.$ajax.post(_this.loginUrl, params).then((response) => {console.log();
          if (response.data.code === 200) {
            _this.$message({
              message: '登录成功', type: 'success', duration: 1000, onClose: function () {
                //获取用户信息
                _this.getUser();
              }
            });
          }else {
            let errorMsg = response.data.msg ? ('登录失败,' + response.data.msg) : "登录失败";
            _this.$message({message: errorMsg, type: 'error'});
          }
        });
      },
      //获取用户信息
      getUser() {
        let _this = this;
        _this.$ajax.get(_this.currentUserUrl).then(res => {
          if (res.data.code == 200) {
            let isSuper = res.data.isSuper;
            let userInfo = res.data.data;
            _this.$store.commit("setIsSuper",isSuper);
            if(!isSuper) {
              _this.$store.commit("setSysData",userInfo);
            }
            //跳转到主页
            _this.$router.push({
              name: "index"
            });
          } else {
            _this.$message.error(res.data.msg);
          }
        });
      },
    }
  };
</script>
<style scoped>
.userStyle {
  padding-left: 40px;
}
</style>