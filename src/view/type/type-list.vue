<!-- 图书分类管理 -->
<template>
  <div>
    <el-row>
      <el-col :span="6">
        <div class="treeDiv">
          <el-input
            placeholder="输入分类名称"
            v-model="filterText"
            clearables
          >
          </el-input>
          <el-button type="text" @click="searchAll">全部</el-button>
          <el-tree
            class="filter-tree"
            accordion
            :data="treeNodeList"
            :props="defaultProps"
            :default-expand-all="expandAll"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            ref="tree">
          </el-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="tableDiv">
          <div class="ui-option">
            <div class="option-left">
              <div class="option-item">
                <el-button
                  size="small"
                  class="operation"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addRootType"
                >新增顶级分类</el-button>
                <el-button
                  size="small"
                  class="operation"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addType"
                >新增分类</el-button>
              </div>
            </div>
            <div class="option-right">
              <div class="option-item">
                <el-form :inline="true">
                  <el-form-item>
                    <el-input size="small" v-model="typeName" placeholder="分类名称" clearable></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button class="search-btn" size="small" type="primary" @click="onSearch">检索</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>

          <el-table :data="typeList" stripe border style="width: 100%;">
            <el-table-column label="序号" align="center" type="index" width="50"></el-table-column>
            <el-table-column prop="typeName" label="分类名称" align="center" min-width="200"></el-table-column>
            <el-table-column prop="leval" label="分类级别" align="center" min-width="200"></el-table-column>
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
        </div>
      </el-col>
    </el-row>

    <el-dialog
      title="添加顶级分类"
      :visible.sync="rootTypeDialogVisible"
      width="550px"
      @close="handleClose('typeFormData')"
    >
      <el-form :model="typeFormData" ref="typeFormData" :rules="rules">
        <el-form-item label="分类名称:" :label-width="formLabelWidth" prop="typeName">
          <el-input v-model="typeFormData.typeName" autocomplete="off" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="排序:" :label-width="formLabelWidth" prop="sortNum">
          <el-input v-model.number="typeFormData.sortNum" autocomplete="off" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveRootType('typeFormData')" :loading="loading">保存</el-button>
        <el-button @click="rootTypeDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="typeTitle"
      :visible.sync="typeDialogVisible"
      width="550px"
      @close="handleClose('typeFormData')"
    >
      <el-form :model="typeFormData" ref="typeFormData" :rules="rules">
        <el-form-item label="分类名称:" :label-width="formLabelWidth" prop="typeName">
          <el-input v-model="typeFormData.typeName" autocomplete="off" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="上级分类:" :label-width="formLabelWidth">
          <el-input v-model="parentName" autocomplete="off" style="width: 300px;" disabled></el-input>
        </el-form-item>
        <el-form-item label="顶级分类:" :label-width="formLabelWidth">
          <el-input v-model="rootName" autocomplete="off" style="width: 300px;" disabled></el-input>
        </el-form-item>
        <el-form-item label="排序:" :label-width="formLabelWidth" prop="sortNum">
          <el-input v-model.number="typeFormData.sortNum" autocomplete="off" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveOrType('typeFormData')" :loading="loading">保存</el-button>
        <el-button @click="typeDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: function() {
    var checkSort = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('排序不能为空'));
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'));
      } else {
          callback();
      }
    };
    return {
      //树形节点URL
      treeNodeUrl: this.$url + "type/treeNodes",
      //查询列表URL
      initListUrl: this.$url + "type/queryListPage2",
      //保存URL
      saveUrl: this.$url + "type/save",
      //更新URL
      updateUrl: this.$url + "type/update",
      //删除URL
      deleteUrl: this.$url + "type/delete",
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 1,
      expandAll: false,
      //过滤分类
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      //树形节点集合
      treeNodeList: [],
      //选中节点
      selectedNode: '',
      //分类名称
      typeName: '',
      //上级分类
      parentName: '',
      //顶级分类
      rootName: '',
      //宽度
      formLabelWidth: "150px",
      //规则
      rules: {
        typeName: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ],
        sortNum: [
          { required: true, message: "请输入排序", trigger: "blur" },
          { validator: checkSort, trigger: 'blur'}
        ],
      },
      //顶级分类弹框
      rootTypeDialogVisible:false,
      //弹框
      typeDialogVisible:false,
      //表单名
      typeTitle: '',
      //类型集合
      typeList: [],
      //分类
      typeFormData: {
        typeId: '',
        typeName: '',
        leval: 1,
        parentId: '',
        rootId: '',
        sortNum: '',
        createTime: new Date()
      }
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    //过滤节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
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
    //查询全部
    searchAll() {
      this.selectedNode = "";
      //查询
      this.onSearch();
    },
    //点击节点
    handleNodeClick(data) {
      this.selectedNode = data;
      //查询
      this.onSearch();
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
      params.append("parentId",_this.selectedNode != "" ? _this.selectedNode.id : '');
      params.append("typeName",_this.typeName);
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
    //创建实例
    getInstance() {
        return {
          typeId: '',
          typeName: '',
          leval: 1,
          parentId: '',
          rootId: '',
          sortNum: '',
          createTime: new Date()
        }
    },
    //添加顶级类型
    addRootType() {
      this.typeTitle = '添加顶级类型';
      this.loading = false;
      this.typeFormData = this.getInstance();
      this.rootTypeDialogVisible = true;
    },
    //添加类型
    addType() {
      if(this.selectedNode == "") {
        this.$message({
          message: "请选择上级分类",
          type: "error"
        });
        return;
      }
      if(Number(this.selectedNode.leval) >= 3) {
        this.$message({
          message: "最多支持三级分类",
          type: "error"
        });
        return;
      }
      this.typeTitle = '添加类型';
      this.loading = false;
      this.typeFormData = this.getInstance();
      this.typeFormData.leval = Number(this.selectedNode.leval) + 1;
      this.typeFormData.parentId = this.selectedNode.id;
      this.parentName = this.selectedNode.label;
      if(Number(this.selectedNode.leval) == 1) {
        this.typeFormData.rootId = this.selectedNode.id;
        this.rootName = this.selectedNode.label;
      }
      else {
        this.typeFormData.rootId = this.selectedNode.rootId;
        let node = this.treeNodeList.find(item=>item.id==this.selectedNode.rootId);
        if(node) {
          this.rootName = node.label;
        }
      }
      this.typeDialogVisible = true;
    },
    //编辑类型
    toEdit(row){
      this.typeTitle = '修改类型';
      this.loading = false;
      this.typeFormData = Object.assign({}, row);
      if(this.typeFormData.leval == 1) {
        this.parentName = "";
        this.rootName = "";
      }
      else {
        if(this.selectedNode == "") {
          let node = this.treeNodeList.find(item=>item.id==this.typeFormData.rootId);
          if(node) {
            this.rootName = node.label;
            if(this.typeFormData.leval == 2) {
              this.parentName = node.label;
            }
            else if(this.typeFormData.leval == 3) {
              let cnode = node.children.find(item=>item.id==this.typeFormData.parentId);
              if(cnode) {
                this.parentName = cnode.label;
              }
            }
          }
        }
        else {
          this.parentName = this.selectedNode.label;
          let node = this.treeNodeList.find(item=>item.id==this.selectedNode.rootId);
          if(node) {
            this.rootName = node.label;
          }
        }
      }
      this.typeDialogVisible = true;
    },
    //删除类型
    toDelete(row){
      var _this = this;
      _this
        .$confirm("确认删除记录吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          //执行删除操作
          _this.$ajax.delete(_this.deleteUrl + "/" + row.typeId).then(res => {
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
    //保存顶级分类
    saveRootType(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.loading = true;
          _this.$ajax.post(_this.saveUrl, _this.typeFormData).then(res => {
            res = res.data;
            _this.loading = false;
            if (res.code == 200) {
              _this.$message({
                message: "保存成功",
                type: "success"
              });
              _this.rootTypeDialogVisible = false;
              _this.initList();
              _this.getTreeNodeList();
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
    //保存或更新类型
    saveOrType(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.loading = true;
          if (_this.typeFormData.typeId == "") {
            _this.$ajax.post(_this.saveUrl, _this.typeFormData).then(res => {
              res = res.data;
              _this.loading = false;
              if (res.code == 200) {
                _this.$message({
                  message: "保存成功",
                  type: "success"
                });
                _this.typeDialogVisible = false;
                _this.initList();
                _this.getTreeNodeList();
              } else {
                _this.$message({
                  message: res.msg,
                  type: "error"
                });
              }
            });
          } else {
            _this.$ajax.put(_this.updateUrl, _this.typeFormData).then(res => {
              res = res.data;
              _this.loading = false;
              if (res.code == 200) {
                _this.$message({
                  message: "更新成功",
                  type: "success"
                });
                _this.typeDialogVisible = false;
                _this.initList();
                _this.getTreeNodeList();
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
      return this.typeList.length > 0;
    }
  },
  mounted() {
    //获取分类树形节点集合
    this.getTreeNodeList();
    this.initList();
  }
};
</script>
<style scoped>
.treeDiv {
  width: 100%;
  height: 100%;
  padding-right: 10px;
  border-right: 1px solid #E5E5E5;
}

.tableDiv {
  padding-left: 20px;
}
</style>