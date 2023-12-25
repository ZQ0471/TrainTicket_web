<template>
  <div class="app-container">
    <el-form :model="searchForm" ref="searchForm">
      <el-row :gutter="20" style="margin-top: 10px">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-autocomplete
              class="inline-input"
              v-model="searchForm.trainNo"
              :fetch-suggestions="querySearch"
              placeholder="请输入要搜索的列车号"
              :trigger-on-focus="true"
            ></el-autocomplete>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button type="primary" round @click="searchData">搜索</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="车次" align="center">
        <template slot-scope="scope">
          {{ scope.row.trainNo }}
        </template>
      </el-table-column>
      <el-table-column label="车站名" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stationName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到站时间" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.arriveTime }}
        </template>
      </el-table-column>
      <el-table-column label="离站时间" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.leaveTime }}
        </template>
      </el-table-column>
      <el-table-column label="站点次序" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.stationOrder }}
        </template>
      </el-table-column>
    </el-table>
    <div class="Pagination" style="text-align: left;margin-top: 10px;">
      <el-pagination
        background
        layout="prev, pager, next, total"
        :total="total"
        :current-page="currentPage"
        class="mt-4"
        :page-size="pageSize"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import { getTrainName } from '@/api/train'
import { getStationList } from '@/api/station'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      searchForm: {
        trainNo: null
      },
      tableData: null,
      trainNum: null,
      list: null,
      currentPage: 1,
      total: 50,
      pageSize: 10,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getTrainName().then(response => {
        this.trainNum = response.data.number
        this.listLoading = false
      })
    },
    searchData() {
      if (this.searchForm.trainNo) {
        this.listLoading = true
        console.log(this.searchForm.trainNo)
        getStationList(this.searchForm.trainNo).then(response => {
          this.list = response.data.items
          this.listLoading = false
          this.getTableData()
        })
      }
    },
    getTableData() {
      this.tableData = this.list.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize)
      this.total = this.list.length
    },
    handlePageChange(val) {
      this.currentPage = val
      this.getTableData()
    },
    querySearch(queryString, cb) {
      const NumberList = this.trainNum
      const results = queryString ? NumberList.filter(this.createFilter(queryString)) : NumberList
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 1000 * Math.random())
    },
    createFilter(queryString) {
      return (Number) => {
        return (Number.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    }
  }
}
</script>
