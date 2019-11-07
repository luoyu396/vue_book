<template>
  <div class="header">
    <h1 class="logo">
      网络图书交易系统
    </h1>
    <div class="login-info">
      <el-dropdown placement="bottom"  @command="phandleCommand">
            <span class="mr10 dsf aic cfff">
              <template v-if="isSuper">
                超级管理员
              </template>
              <template v-else>
                {{user.userName}}
              </template>
              <i class="el-icon-arrow-down ml10"></i>
            </span>
          <el-dropdown-menu slot="dropdown">
              <template v-if="!isSuper">
                <el-dropdown-item >修改密码</el-dropdown-item>
                <el-dropdown-item >基本信息</el-dropdown-item>
              </template>
              <el-dropdown-item  command="logout">退出系统</el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    user:{type:Object},
    isSuper:{
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  mounted: function() {
  },
  components: {},
  methods: {
    phandleCommand(command){
      this.handleCommand(command);
    }
  },
  inject:['handleCommand']
}
</script>
<style scope>
.top_menu{
  flex: auto;
  margin:auto 8px;
  width: 60%;
  float: left;
  height: 50px;
  margin-left: 20px;
}
.el-menu-demo {
  background: #35439D;
}
.top_menu .el-menu--horizontal>.el-menu-item {
  height: 50px;
  line-height: 50px;
  color: #FFFFFF;
  font-weight: 700;
  border-bottom: 4px solid #1890ff;
  padding: 0px 5px;
}
.top_menu .el-menu--horizontal>.el-menu-item:hover , .top_menu .el-menu--horizontal>.el-menu-item:focus{
  background: #35439D;
  color: #FFFFFF;
}
</style>
