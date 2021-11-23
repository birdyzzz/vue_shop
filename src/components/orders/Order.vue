<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          label="订单编号"
          prop="order_number"
          width="300px"
        ></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
          <template slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.is_send === '是'"></i>
            <i class="el-icon-error" v-else></i>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showAddressDialog"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location"
              @click="showLocationDialog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="地址" :visible.sync="addressDialogVisible" width="30%">
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="city">
          <el-cascader
            v-model="addressForm.city"
            :props="props"
            :options="cityData"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detail">
          <el-input v-model="addressForm.detail"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="物流信息"
      :visible.sync="locationDialogVisible"
      width="40%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in kuaidi"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="locationDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="locationDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '../orders/cityData'
import kuaidi from '../orders/kuaidi'
export default {
  name: 'Order',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      addressDialogVisible: false,
      locationDialogVisible: false,
      cityData,
      addressForm: {
        city: [],
        detail: ''
      },
      addressFormRules: {
        city: [{ required: true, message: '不能为空', trigger: 'blur' }],
        detail: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      props: {
        expandTrigger: 'hover',
        label: 'label',
        value: 'value',
        children: 'children'
      },
      kuaidi
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$msg.error('获取订单列表失败！')
      }
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },

    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    showAddressDialog() {
      this.addressDialogVisible = true
    },
    async showLocationDialog() {
      this.locationDialogVisible = true
    },
    handleChange() {}
  }
}
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 15px;
}
.el-icon-success {
  color: green;
}
.el-icon-error {
  color: red;
}
</style>
