<!-- 订单管理 -->
<template>
  <div>
    <div class="ui-option">
      <div class="option-right">
        <div class="option-item">
          <el-form :inline="true">
            <el-form-item label="订单编号">
              <el-input size="small" v-model="searchParams.orderId" placeholder="订单编号"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input size="small" v-model="searchParams.userName" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select
                placeholder="请选择订单状态"
                size="small"
                class="el-mini"
                v-model="searchParams.orderStatus"
                clearable
              >
                <el-option v-for="status in orderStatusList" :label="status.label" :value="status.value" :key="status.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button class="search-btn" size="small" type="primary" @click="onSearch">检索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <el-table :data="orderInfoList" stripe border style="width: 100%;">
      <el-table-column label="序号" align="center" type="index" width="50"></el-table-column>
      <el-table-column prop="orderId" label="订单编号" align="center" min-width="200"></el-table-column>
      <el-table-column prop="userName" label="用户名" align="center" min-width="200"></el-table-column>
      <el-table-column prop="orderStatus" label="订单状态" align="center" min-width="200">
        <template slot-scope="scope">
          {{orderStatusList.find(item=>item.value===scope.row.orderStatus)?orderStatusList.find(item=>item.value===scope.row.orderStatus).label:''}}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="下单时间" align="center" min-width="200" :formatter="formatTime"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-view"
            class="icon_size"
            type="text"
            title="查看"
            @click="toView(scope.row)"
          ></el-button>
          <el-button
            v-if="scope.row.orderStatus == '1'"
            icon="el-icon-check"
            class="icon_size"
            type="text"
            title="发货"
            @click="sendOut(scope.row)"
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
      title="订单详情"
      :visible.sync="orderInfoDialogVisible"
      width="850px"
      @close="handleClose('orderInfoFormData')"
    >
      <el-form :model="orderInfoFormData" ref="orderInfoFormData" :inline="true" class="order_info_form">
        <el-form-item label="订单编号:" :label-width="formLabelWidth">
          <el-input v-model="orderInfoFormData.orderId" class="input_item" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名:" :label-width="formLabelWidth">
          <el-input v-model="orderInfoFormData.userName" class="input_item" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单状态:" :label-width="formLabelWidth">
          <el-input v-model="orderInfoFormData.orderStatus" class="input_item" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="合计金额(元):" :label-width="formLabelWidth">
          <el-input v-model="orderInfoFormData.totalMoney" class="input_item" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="下单时间:" :label-width="formLabelWidth">
          <el-input v-model="orderInfoFormData.createTime" class="input_item" autocomplete="off" disabled></el-input>
        </el-form-item>
        <div>
          <el-form-item label="地址:" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="orderInfoFormData.address" class="input_area_item" rows="2" disabled></el-input>
          </el-form-item>
        </div>
        <div>
          <el-table :data="orderItemInfoList" stripe border style="width: 100%;margin-bottom:20px">
            <el-table-column label="序号" align="center" type="index" width="50"></el-table-column>
            <el-table-column prop="bookName" label="图书名称" align="center" min-width="150"></el-table-column>
            <el-table-column prop="bookPrice" label="图书价格(元)" align="center"></el-table-column>
            <el-table-column prop="bookCount" label="图书数量" align="center"></el-table-column>
            <el-table-column prop="subTotal" label="小计(元)" align="center"></el-table-column>
          </el-table>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
var moment = require("moment");

export default {
  data: function() {
    return {
      //查询列表URL
      initListUrl: this.$url + "orderInfo/queryListPage2",
      //更新URL
      updateUrl: this.$url + "orderInfo/update",
      //订单条目
      orderItemUrl: this.$url + "orderItemInfo/queryList",
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 1,
      //宽度
      formLabelWidth: "150px",
      //查询参数
      searchParams: {
        orderId: "",
        userName: "",
        orderStatus: ""
      },
      //订单状态集合
      orderStatusList:[
        {
          label: "已提交",
          value: "1"
        },
        {
          label: "配送中",
          value: "2"
        },
        {
          label: "已完成",
          value: "3"
        },
        {
          label: "已取消",
          value: "4"
        },
      ],
      //列表数据
      orderInfoList: [],
      //表单
      orderInfoFormData: {},
      //订单条目集合
      orderItemInfoList: [],
      //弹框
      orderInfoDialogVisible: false
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
      params.append("orderId", _this.searchParams.orderId);
      params.append("userName", _this.searchParams.userName);
      params.append("orderStatus", _this.searchParams.orderStatus);
      params.append("contentType", 1);
      _this.$ajax.post(_this.initListUrl, params).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.orderInfoList = res.data.list;
          _this.total = res.data.total;
          _this.currentPage = res.data.pageNum;
          _this.pageSize = res.data.pageSize;
        } else {
          _this.orderInfoList = [];
          _this.$message({
            message: "列表初始化失败",
            type: "error"
          });
        }
      });
    },
    //查看订单
    toView(row) {
      var _this = this;
      _this.orderInfoFormData = Object.assign({}, row);
      let status = _this.orderStatusList.find(item=>item.value == row.orderStatus);
      _this.orderInfoFormData.orderStatus = status.label;
      _this.orderInfoFormData.createTime = moment(row.createTime).format("YYYY-MM-DD H:m:s");
      let params = new URLSearchParams();
      params.append("orderId", row.orderId);
      params.append("contentType", 1);
      _this.$ajax.get(_this.orderItemUrl, params).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.orderItemInfoList = res.data;
        } else {
          _this.orderItemInfoList = [];
          _this.$message({
            message: "列表初始化失败",
            type: "error"
          });
        }
        this.orderInfoDialogVisible = true;
      });
    },
    //发货
    sendOut(row){
      var _this = this;
      _this.$confirm("确认发货吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          _this.orderInfoFormData = Object.assign({}, row);
          _this.orderInfoFormData.orderStatus = "2";
          _this.$ajax.put(_this.updateUrl, _this.orderInfoFormData).then(res => {
            res = res.data;
            _this.loading = false;
            if (res.code == 200) {
              _this.$message({
                message: "发货成功",
                type: "success"
              });
              _this.bookDialogVisible = false;
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
    formatTime(row, column) {
      return moment(row.createTime).format("YYYY-MM-DD H:m:s");
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
    }
  },
  computed: {
    showPageFlag: function() {
      return this.orderInfoList.length > 0;
    }
  },
  mounted() {
    this.initList();
  }
};
</script>
<style lang="scss">
    .order_info_form {
        .el-form-item__content {
          width: 200px !important;
        }
        .el-form-item__label{
            line-height: 20px;
            padding-top:10px;
        }
        .form_item_custom{
            .el-form-item__label{
                padding-top: 0px;
            }
        }
        .input_area_item{
            width:555px;
        }
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 200px;
    }
</style>