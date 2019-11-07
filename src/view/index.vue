<template>
  <div>
    <v-header
      v-if="($route.name!='login' && $route.name!='register' && $route.name!='registerSuccess')"
      :user="userInfo"
      :isSuper="isSuper"
    />
    <div class="body">
      <v-nav :menus="menuList" />
      <div class="inner-content content">
        <router-view class="body-content" />
      </div>
    </div>
  </div>
</template>
<script>
import Header from "../components/header";
import Nav from "../components/nav.vue";

export default {
  data() {
    return {
      //退出
      logoutUrl: this.$url + "adminLogin/logout",
      //当前用户
      currentUserUrl: this.$url + "user/currentUser",
      //是否超级管理员
      isSuper: false,
      //用户信息
      userInfo: {},
      //菜单集合
      menuList: []
    };
  },
  components: {
    "v-header": Header,
    "v-nav": Nav
  },
  methods: {
    //获取用户信息
    getUser() {
      let _this = this;
      _this.$ajax.get(_this.currentUserUrl).then(res => {
        if (res.data.code == 200) {
          _this.isSuper = res.data.isSuper;
          _this.userInfo = res.data.data;
          //初始化菜单
          _this.initMenu();
        } else {
          _this.$message.error(res.data.msg);
          //跳转到登录
          _this.$router.push({
            name: "login"
          });
        }
      });
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

      //修改密码
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
        menuName: "图书分类管理"
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

