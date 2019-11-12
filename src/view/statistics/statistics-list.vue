<!-- 统计管理 -->
<template>
  <div>
    <div class="ui-option">
      <div class="option-left">
        <div class="option-item">
          <span style="color:red;">*</span>
          <span>选择开始与结束时间进行统计</span>
        </div>
      </div>
      <div class="option-right">
        <div class="option-item">
          <el-form :inline="true">
            <el-form-item label="统计类型:">
              <el-select
                placeholder="请选择统计类型"
                size="small"
                v-model="searchParams.statisticsType"
                @change="changeStatisticsType"
              >
                <el-option label="销量统计" value="1"></el-option>
                <el-option label="销售额统计" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分类">
              <select-tree
                ref="selectTree"
                class="stree"
                :props="props"
                :options="treeNodeList"
                :clearable="isClearable"
                :accordion="isAccordion"
                @getvalue="getvalue($event)"
              ></select-tree>
            </el-form-item>
            <el-form-item label="统计时间">
              <el-date-picker
                v-model="searchParams.startTime"
                type="date"
                size="small"
                value-format="yyyy-MM-dd"
              ></el-date-picker>-
              <el-date-picker
                v-model="searchParams.endTime"
                type="date"
                size="small"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button class="search-btn" size="small" type="primary" @click="onSearch">统计</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-table :data="statisticsList" stripe border style="width: 100%;">
      <el-table-column label="序号" align="center" type="index" width="50"></el-table-column>
      <el-table-column prop="bookName" label="图书名称" align="center" min-width="150"></el-table-column>
      <el-table-column prop="isbn" label="ISBN" align="center"></el-table-column>
      <el-table-column prop="publisher" label="出版社" align="center"></el-table-column>
      <el-table-column prop="author" label="作者" align="center"></el-table-column>
      <el-table-column prop="typeName" label="分类" align="center"></el-table-column>
      <template v-if="searchParams.statisticsType == '1'">
        <el-table-column prop="saleCount" label="销售数量" align="center"></el-table-column>
      </template>
      <template v-else>
        <el-table-column prop="totalSalePrice" label="销售额" align="center"></el-table-column>
      </template>
    </el-table>
    <div class="table_page" v-show="showPageFlag" style="position: relative;">
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
      <span style="position: absolute;top: 0px;right: 10px;">{{totalValue}}</span>
    </div>
  </div>
</template>

<script>
import treeSelect from "@/components/tree-select.vue";

export default {
  components: {
    "select-tree": treeSelect
  },
  data: function() {
    return {
      //查询列表URL
      initListUrl: this.$url + "statistics/statisticses",
      //树形节点URL
      treeNodeUrl: this.$url + "type/treeNodes",
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 1,
      //宽度
      formLabelWidth: "150px",
      //树形节点集合
      treeNodeList: [],
      // 可清空（可选）
      isClearable: true,
      // 可收起（可选）
      isAccordion: true,
      // 配置项（必选）
      props: {
        value: "id",
        label: "label",
        children: "children"
      },
      //查询参数
      searchParams: {
        statisticsType: '1',
        typeId: '',
        startTime: '',
        endTime: ''
      },
      //列表数据
      statisticsList: [],
      //统计值
      totalValue: ""
    };
  },
  methods: {
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
    // 下拉切换 取值
    getvalue(value){
      this.searchParams.typeId = value == null ? "" : value;
    },
    //切换统计类型
    changeStatisticsType() {
      if(this.searchParams.startTime != "" && this.searchParams.endTime != "") {
        //查询
        this.onSearch();
      }
      else {
        this.statisticsList = [];
      }
    },
    //查询
    onSearch() {
      this.currentPage = 1;
      if(this.searchParams.startTime == "") {
        this.$message({
          message: "开始时间不能为空",
          type: "error"
        });
        return;
      }
      if(this.searchParams.endTime == "") {
        this.$message({
          message: "结束时间不能为空",
          type: "error"
        });
        return;
      }
      if(this.searchParams.startTime > this.searchParams.endTime) {
        this.$message({
          message: "开始时间不能大于结束时间",
          type: "error"
        });
        return;
      }
      this.initList();
    },
    //初始化列表
    initList() {
      var _this = this;
      var params = Object.assign(
        {
          statisticsType: _this.searchParams.statisticsType,
          page: _this.currentPage,
          rows: _this.pageSize,
          typeId: this.searchParams.typeId,
          startTime: _this.searchParams.startTime + " 00:00:00",
          endTime: _this.searchParams.endTime + "23:59:59"
        }
      );
      _this.$ajax.post(_this.initListUrl, params).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.statisticsList = res.data.list;
          _this.total = res.data.total;
          _this.currentPage = res.data.pageNum;
          _this.pageSize = res.data.pageSize;
          _this.totalValue = res.totalValue;
        } else {
          _this.statisticsList = [];
          _this.totalValue = "";
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
    }
  },
  computed: {
    showPageFlag: function() {
      return this.statisticsList.length > 0;
    }
  },
  mounted() {
    //获取分类树形节点集合
    this.getTreeNodeList();
  }
};
</script>
<style lang="scss">
.stree .el-input__inner {
  height: 28px !important;
  line-height: 28px !important;
}
</style>