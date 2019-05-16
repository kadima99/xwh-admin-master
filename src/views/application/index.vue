<template>
  <el-container>
    <el-header>
      <el-row :inline="true">
        <el-select v-model="search" placeholder="申请部门">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-row>
    </el-header>
    <el-main>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="申请人名字">
                <span>{{ props.row.applicant }}</span>
              </el-form-item>
              <el-form-item label="申请人部门">
                <span>{{ props.row.unit }}</span>
              </el-form-item>
              <el-form-item label="联系方式">
                <span>{{ props.row.contact }}</span>
              </el-form-item>
              <el-form-item label="任务描述">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="任务地点">
                <span>{{ props.row.location }}</span>
              </el-form-item>
              <el-form-item label="任务日期">
                <span>{{ props.row.executeTime }}</span>
              </el-form-item>
              <el-form-item label="申请日期">
                <span>{{ props.row.applyTime }}</span>
              </el-form-item>
              <el-form-item label="申请部门">
                <span>{{ props.row.dept }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="申请人" prop="applicant"></el-table-column>
        <el-table-column label="任务日期" prop="applyTime" sortable></el-table-column>
        <el-table-column label="申请日期" prop="executeTime" sortable></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status==3">已通过</el-tag>
            <el-tag type="warning" v-if="scope.row.status==1">待审核</el-tag>
            <el-tag type="danger" v-if="scope.row.status==2">未通过</el-tag>
            <el-tag type="danger" v-if="scope.row.status==0">已放弃</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showEdit(scope.row,scope.$index)"
            ></el-button>
            <el-button type="success" icon="el-icon-check" circle @click="accept(scope.$index)"></el-button>
            <el-button type="danger" icon="el-icon-close" circle @click="refuse(scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="sizePage"
          layout="total, prev, pager, next"
          :total="totalPage"
        ></el-pagination>
      </div>
    </el-main>
    <el-dialog title="详情情况" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="100px" ref="editForm">
        <el-form-item label="申请人名字:">
          {{editForm.applicant}}
        </el-form-item>
        <el-form-item label="申请人部门:">
          {{editForm.unit}}
        </el-form-item>
        <el-form-item label="联系方式:">
          {{editForm.contact}}
        </el-form-item>
        <el-form-item label="任务描述:">
          {{editForm.description}}
        </el-form-item>
        <el-form-item label="任务地点:">
          {{editForm.location}}
        </el-form-item>
        <el-form-item label="任务日期:">
          {{editForm.applyTime}}
        </el-form-item>
        <el-form-item label="任务日期:">
          {{editForm.executeTime}}
        </el-form-item>
        <el-form-item label="申请部门:">
          {{editForm.dept}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
  import {add, getAll, update} from '../../api/apply'

  export default {
    data() {
      return {
        editForm: {
          id: "",
          applicant: "",
          description: "",
          executeTime: "",
          applyTime: "",
          dept: [],
          unit: "",
          location: "",
          status: "",
          contact: ""
        },
        options: [
          {
            value: "1",
            label: "网络部"
          },
          {
            value: "2",
            label: "摄影部"
          },
          {
            value: "3",
            label: "新闻部"
          },
          {
            value: "4",
            label: "美工部"
          },
          {
            value: "5",
            label: "新宣部"
          }
        ],
        search: "",
        dialogFormVisible: false,
        currentPage: 1,
        totalPage: 1000,
        sizePage: 100,
        tableData: []
      };
    },
    created: function () {
      this.getAll()
    }
    ,
    methods: {
      accept: function (id) {
        this.$confirm("确认通过?", "提示", {})
          .then(() => {
            update(id).then(res => {
              if (res) {
                this.$notify({
                  title: "成功",
                  message: "申请成功通过",
                  type: "success"
                })
              } else {
                this.$notify({
                  title: "失败",
                  message: "申请通过失败",
                  type: "warning"
                });

              }
            })

          })
          .catch(() => {
          });
      },
      refuse: function (id) {
        this.$confirm("确认拒绝?", "提示", {})
          .then(() => {
            console.log(id);
            if (this.tableData[id].state == -1)
              this.$notify({
                title: "失败",
                message: "申请已经拒绝",
                type: "warning"
              });
            else {
              this.tableData[id - 1].state = -1;
              this.$notify({
                title: "成功",
                message: "申请成功拒绝",
                type: "success"
              })
            }

          })
          .catch(() => {
          });
      },
      showEdit(row, _index) {
        //记录索引
        this.listIndex = _index;
        //记录数据
        this.editForm = row;
        console.log(this.editForm.id);
        //显示弹窗
        this.dialogFormVisible = true;
        console.log(this.dialogFormVisible);
      },
      editDo() {
        this.$notify({
          title: "成功",
          message: "修改成功",
          type: "success"
        });
        this.dialogFormVisible = false;
        console.log(this.dialogFormVisible);
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      getAll() {
        getAll().then(res => {
          this.tableData = res.data;
          console.log(this.tableData)
        }).catch(err => {
          this.$notify.error({
            title: '错误',
            message: err.toString()
          })
        })
      }
    }
  };
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .block {
    text-align: center;
    margin-top: 20px;
  }
</style>
