<!-- 统计管理 -->
<template>
  <div>
    
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
      //宽度
      formLabelWidth: "150px",
      //查询参数
      searchParams: {
        
      },
      //列表数据
      userList: []
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.initList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initList();
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
};
</script>