<!-- 图书分类管理 -->
<template>
  <div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      //查询列表URL
      initListUrl: this.$url + "type/queryListPage2",
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 1,
      //宽度
      formLabelWidth: "150px",
      //规则
      rules: {

      },
      //弹框
      typeDialogVisible:false,
      //表单名
      typeTitle: '',
      //类型集合
      typeList: []
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
          _this.typeList = res.data.list;
          _this.total = res.data.total;
          _this.currentPage = res.data.pageNum;
          _this.pageSize = res.data.pageSize;
        } else {
          _this.typeList = [];
          _this.$message({
            message: "列表初始化失败",
            type: "error"
          });
        }
      });
    },
    //添加类型
    addType() {
      this.typeTitle = '添加类型';
      this.loading = false;
      this.typeDialogVisible = true;
    },
    //编辑类型
    toEdit(row){
      this.typeTitle = '修改类型';
      this.loading = false;
      this.typeFormData = row;
      this.typeDialogVisible = true;
    },
    //删除类型
    toDelete(row){

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
    //保存或更新类型
    saveOrType() {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.loading = true;
          if (_this.dictFormData.typeId == "") {
            _this.$ajax
              .post(_this.enterDictTypeUrl, _this.dictFormData)
              .then(res => {
                res = res.data;
                _this.loading = false;
                if (res.code == 200) {
                  _this.$message({
                    message: res.msg,
                    type: "success"
                  });
                  _this.dialogTableVisible = false;
                  _this.initList();
                } else {
                  _this.$message({
                    message: res.msg,
                    type: "error"
                  });
                }
              });
          } else {
            _this.$ajax
              .put(_this.enterDictTypeUrl, _this.dictFormData)
              .then(res => {
                res = res.data;
                _this.loading = false;
                if (res.code == 200) {
                  _this.$message({
                    message: res.msg,
                    type: "success"
                  });
                  _this.dialogTableVisible = false;
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
      return this.userList.length > 0;
    }
  },
  mounted() {
    this.initList();
  }
};
</script>