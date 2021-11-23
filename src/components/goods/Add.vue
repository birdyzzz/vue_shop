<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert
      title="添加商品信息"
      type="info"
      center
      show-icon
      :closable="false"
    >
    </el-alert>
    <el-steps
      :space="200"
      :active="activeIndex - 0"
      finish-status="success"
      align-center
    >
      <el-step title="基本信息">基本信息</el-step>
      <el-step title="商品参数">商品参数</el-step>
      <el-step title="商品属性">商品属性</el-step>
      <el-step title="商品图片">商品图片</el-step>
      <el-step title="商品内容">商品内容</el-step>
      <el-step title="完成">ok</el-step>
    </el-steps>
    <el-form
      :model="addForm"
      :rules="addFormRules"
      ref="addFormRef"
      label-width="100px"
      label-position="top"
    >
      <el-tabs
        tab-position="left"
        v-model="activeIndex"
        :before-leave="beforeTabLeave"
        @tab-click="tabClick"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              v-model="addForm.goods_cat"
              :options="cateList"
              :props="cascaderProps"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item
            :label="item.attr_name"
            v-for="item in manyTableData"
            :key="item.attr_id"
          >
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                :label="item2"
                v-for="(item2, index) in item.attr_vals"
                :key="index"
                border
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item
            :label="item.attr_name"
            v-for="item in onlyTableData"
            :key="item.attr_id"
          >
            <el-input v-model="item.attr_vals"></el-input
          ></el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headersOBJ"
            :on-success="uploadSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model="addForm.goods_introduce" />
          <el-button type="primary" round class="btnAdd" @click="addGoods"
            >添加商品</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <el-dialog :visible.sync="previewDialogVisible" width="50%">
      <img :src="imgSrc" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Add',
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],

        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      headersOBJ: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewDialogVisible: false,
      imgSrc: '',
      form: {}
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('/categories')
      if (res.meta.status !== 200) {
        return this.$msg.error('获取商品分类列表失败！')
      }
      this.cateList = res.data
    },
    handleChange() {
      if (!this.cateId) {
        this.addForm.goods_cat = []
        this.$msg.info('只允许选择第三级分类！')
      }
      // console.log(this.addForm.goods_cat)
    },
    beforeTabLeave(n, o) {
      if (o === '0' && this.addForm.goods_cat.length !== 3) {
        this.$msg.warning('请先选择第三级分类！')
        return false
      }
    },
    async tabClick() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'many' } }
        )
        if (res.meta.status !== 200) {
          return this.$msg.error('获取动态参数列表失败！')
        }
        this.manyTableData = res.data
        res.data.forEach((item) => {
          // console.log(item)
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'only' } }
        )
        if (res.meta.status !== 200) {
          return this.$msg.error('获取静态属性列表失败！')
        }
        this.onlyTableData = res.data
      }
    },
    handlePreview(file) {
      this.imgSrc = file.response.data.url
      this.previewDialogVisible = true
    },

    handleRemove(file) {
      // console.log(file)
      const path = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex((x) => x.tmp_path === path)
      this.addForm.pics.splice(i, 1)
    },
    uploadSuccess(res) {
      const picInfo = { tmp_path: res.data.tmp_path }
      this.addForm.pics.push(picInfo)
    },
    addGoods() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const form = JSON.parse(JSON.stringify(this.addForm))
        form.goods_cat = form.goods_cat.join(',')
        this.manyTableData.forEach((item) => {
          const attrInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          form.attrs.push(attrInfo)
        })
        this.onlyTableData.forEach((item) => {
          const attrInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          form.attrs.push(attrInfo)
        })
        console.log(form)
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$msg.error('添加商品失败！！！')
        }
        this.$msg.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 10px !important;
}
img {
  width: 100%;
}
.ql-editor {
  min-height: 300px;
}
.btnAdd {
  margin-top: 15px !important;
}
</style>
