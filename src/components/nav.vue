<!--菜单-->
<template>
  <div class="nav">
    <el-menu :default-active="activeIndex">
      <div v-for="item in menus" :key="item.menuId">
          <el-menu-item
            @click="clickMenu(item)" 
            :index="item.menuId">
             {{item.menuName}}
          </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  props:{
    menus:{
      type:Array,
      default: new Array()
    }
  },
  data() {
    return {
      activeIndex: ''
    };
  },
  mounted: function() {
  },
  components: {},
  methods: {
    clickMenu(item){alert(item.menuId);
      this.$router.push({
        name: item.menuId
      });
    }
  },
  watch:{
    menus: function (val){
      this.activeIndex = this.menus[0].menuId;
      this.$router.push({
        name: item.menuId
      });
    }
  }
};
</script>