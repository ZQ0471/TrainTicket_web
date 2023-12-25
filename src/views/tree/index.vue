<template>
  <div class="app-container">
    <el-form :model="searchForm" ref="searchForm">
      <el-row :gutter="20" style="margin-top: 10px;width: 800px">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-autocomplete
              class="inline-input"
              v-model="searchForm.start_station"
              :fetch-suggestions="querySearch"
              placeholder="请输入始发站"
              :trigger-on-focus="true"
            ></el-autocomplete>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple" style="margin-left: 20px">
            <el-autocomplete
              class="inline-input"
              v-model="searchForm.end_station"
              :fetch-suggestions="querySearch"
              placeholder="请输入终点站"
              :trigger-on-focus="true"
            ></el-autocomplete>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button type="primary" round @click="Search()">搜索</el-button>
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
      <el-table-column label="始发车次" align="center">
        <template slot-scope="scope">
          {{ scope.row.firstTrain }}
        </template>
      </el-table-column>
      <el-table-column label="起点站" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.firstStation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出发时间" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.time1 }}
        </template>
      </el-table-column>
      <el-table-column label="到达时间" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.time2 }}
        </template>
      </el-table-column>
      <el-table-column label="中转站" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.transitStation }}
        </template>
      </el-table-column>
      <el-table-column label="最终车次车次" align="center">
        <template slot-scope="scope">
          {{ scope.row.lastTrain }}
        </template>
      </el-table-column>
      <el-table-column label="终点站" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lastStation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出发时间" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.time3 }}
        </template>
      </el-table-column>
      <el-table-column label="到达时间" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.time4 }}
        </template>
      </el-table-column>
    </el-table>
    <div class="Pagination" style="text-align: left;margin-top: 10px;">
      <el-pagination
        background
        layout="prev, pager, next, total"
        :total="total"
        :current-page="currentPage"
        @current-change="handlePageChange"
        :page-size="pageSize"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script>
import { getStationName, searchStation } from '@/api/station'

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
        start_station: null,
        end_station: null
      },
      tableData: null,
      trainNum: null,
      list: null,
      currentPage: 1,
      total: null,
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
      getStationName().then(response => {
        this.trainNum = response.data.number
        this.listLoading = false
      })
    },
    Search() {
      if (this.searchForm.start_station !== null && this.searchForm.end_station !== null) {
        this.listLoading = true
        searchStation(this.searchForm.start_station, this.searchForm.end_station).then(response => {
          this.list = response.data.list
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
