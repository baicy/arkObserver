<template>
  <div>
    <el-table
      :data="visibleData"
      v-loading="loading"
      border
      :height="height"
      class="virtual-list-table"
      :row-style="{height: rowHeight+'px'}"
      @sort-change="handleSortChange"
      >
      <el-table-column
        v-for="column,index in columns"
        :key="index"
        :prop="column.column"
        :label="column.label"
        :sortable="column.sortable?'custom':false"
        :width="column.width?column.width:''"
        >
        <template slot-scope="scope">
          <template v-if="column.slot">
            <slot :name="column.slot" :row="scope.row"></slot>
          </template>
          <template v-else>
            {{scope.row[column.column]}}
          </template>
        </template>
       </el-table-column>
     </el-table>
     <el-pagination
       v-if="pagination"
       background
       @size-change="handleSizeChange"
       @current-change="handleCurrentChange"
       :page-sizes="pagination.sizes"
       :page-size.sync="pagination.size"
       :current-page.sync="pagination.current"
       layout="total, sizes, prev, pager, next"
       :total="pagination.total">
     </el-pagination>
   </div>
</template>

<script>
  export default {
    props: {
      data: {
        Type: Array,
        default() {
          return [];
        }
      },
      columns: {
        Type: Array,
        default() {
          return [];
        }
      },
      height: {
        type: Number,
        default() {
          return 300;
        }
      },
      loading: {
        type: Boolean,
        default() {
          return false
        }
      }
    },
    data() {
      return {
        shown: [],
        target: [],
        rowHeight: 57,
        bodyHeight: 0,
        size: 0,
        start: 0,
        offset: 0,
        pagination: {
          size: 200,
          sizes: [100,200,500,1000],
          total: 0,
          current: 1
        },
        defaultPageSize: 200
      }
    },
    computed: {
      visibleData() {
        return this.shown.slice(this.start, Math.min(this.start+this.size, this.shown.length));
      },
      dataHeight() {
        return this.rowHeight*this.shown.length;
      }
    },
    watch: {
      data(newVal, oldVal) {
        this.target = [...newVal];
        this.shown = this.pagination ?
          [...this.target.slice((this.pagination.current-1)*this.pagination.size, this.pagination.current*this.pagination.size)] :
          [...this.target];
        this.pagination.current = 1;
        this.pagination.size = this.defaultPageSize;
        this.pagination.total = this.data.length;
        this.$el.querySelector('.el-table__body').style = 'height: ' + this.dataHeight + 'px';
        this.$nextTick(() => {
          const headerHeight = this.$el.querySelector('.el-table__header-wrapper').getBoundingClientRect().height;
          this.bodyHeight = this.height-headerHeight-1;
          this.size = Math.ceil(this.bodyHeight / this.rowHeight)+1;
          this.$nextTick(() => {
            this.adjustRow();
            this.$emit('update:loading', false);
          });
        });
      }
    },
    methods: {
      handleScroll() {
        const scrollTop = this.$el.querySelector('.el-table__body-wrapper').scrollTop;
        this.start = Math.floor(scrollTop / this.rowHeight);
        this.offset = scrollTop - (scrollTop % this.rowHeight);
        this.$el.querySelector('.el-table__body>tbody').style = `transform:translate(0, ${this.offset}px)`;
      },
      adjustRow() {
        this.$nextTick(() => {
          const firstRow = this.$el.querySelector('.el-table__body>tbody .el-table__row');
          if(firstRow) {
            const colGroup = this.$el.querySelectorAll('.el-table__body>colgroup>col');
            colGroup.forEach((item,index) => {
              firstRow.querySelector('.'+item.getAttribute('name')).style = `width: ${item.width}px`;
            });
          }
        });
      },
      handleSortChange({column, prop, order }) {
        if(order) {
          this.target.sort((a, b) => {
            if(order=='descending') {
              [b, a] = [a, b];
            }
            return a[prop]<b[prop]?-1:1;
          });
        } else {
          this.target = [...this.data];
        }
        
        this.pagination.current = 1;
        this.handleCurrentChange(1);
      },
      handleSizeChange(size) {
        this.pagination.current = 1;
        this.shown = [...this.target.slice(0, size)];
        this.$el.querySelector('.el-table__body').style = 'height: ' + this.dataHeight + 'px';
        this.$el.querySelector('.el-table__body-wrapper').scrollTop = 0;
        this.$nextTick(()=>this.adjustRow());
      },
      handleCurrentChange(current) {
        this.shown = [...this.target.slice((current-1)*this.pagination.size, current*this.pagination.size)];
        this.$el.querySelector('.el-table__body').style = 'height: ' + this.dataHeight + 'px';
        this.$el.querySelector('.el-table__body-wrapper').scrollTop = 0;
        this.$nextTick(()=>this.adjustRow());
      }
    },
    mounted() {
      this.$el.querySelector('.el-table__body-wrapper').onscroll = () => this.handleScroll();
    }
  };
</script>

<style>
  .virtual-list-table .el-table__body>tbody {
    position: absolute;
  }
</style>
