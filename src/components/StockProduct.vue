<template>
  <div class="card mb-5">
    <div class="card-body my-2">

      <div class="text-start mb-5">
        <h3 class="m-0">สต็อกสินค้า</h3>
      </div>

      <form @submit.prevent="searchData">

        <div class="row mb-4 text-start">
          <div class="col-2">
            <label for="startDate">วันเริ่มต้น</label>
            <input type="date" id="startDate" class="form-control" v-model="dataSearch.startDate" :max="today"
              :disabled="statusSearchText">
          </div>
          <div class="col-2">
            <label for="endDate">วันสิ้นสุด</label>
            <input type="date" id="endDate" class="form-control" v-model="dataSearch.endDate" :max="today"
              :disabled="statusSearchText">
          </div>
          <div class="col-2">
            <label for="category">เลือกหมวดหมู่สินค้า</label>
            <select id="category" v-model="dataSearch.category" class="form-control" :disabled="statusSearchText">
              <option value="">เลือกหมวดหมู่สินค้า</option>
              <option value="category1">หมวดหมู่ 1</option>
              <option value="category2">หมวดหมู่ 2</option>
              <option value="category3">หมวดหมู่ 3</option>
            </select>
          </div>
          <div class="col-2">
            <label for="subCategory">เลือกหมวดหมู่สินค้าย่อย</label>
            <select id="subCategory" v-model="dataSearch.subCategory" class="form-control" :disabled="statusSearchText">
              <option value="">เลือกหมวดหมู่สินค้าย่อย</option>
              <option value="subCategory1">หมวดหมู่ย่อย 1</option>
              <option value="subCategory2">หมวดหมู่ย่อย 2</option>
              <option value="subCategory3">หมวดหมู่ย่อย 3</option>
            </select>
          </div>
          <div class="col-3">
            <label for="search"></label>
            <input type="text" id="search" v-model="dataSearch.search" class="form-control" placeholder="ค้นหา">
          </div>
          <div class="col-1">
            <button type="submit" class="btn btn-blue-custom mt-4">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>

        <div class="row text-start">
          <div class="col-2">
            <label for="firstPrice">ใส่ราคา</label>
            <input type="number" id="firstPrice" v-model="dataSearch.firstPrice" class="form-control"
              placeholder="ราคาเริ่มต้น" :disabled="statusSearchText">
          </div>
          <div class="col-2">
            <label for="lastPrice"></label>
            <input type="number" id="lastPrice" v-model="dataSearch.lastPrice" class="form-control"
              placeholder="ราคาสุดท้าย" :disabled="statusSearchText">
          </div>
          <div class="col-2">
            <label for="selectGrade">เลือกเกรด</label>
            <select id="selectGrade" v-model="dataSearch.grade" class="form-control" :disabled="statusSearchText">
              <option value="">ALL</option>
              <option value="A">เกรด A</option>
              <option value="B">เกรด B</option>
              <option value="C">เกรด C</option>
              <option value="D">เกรด D</option>
            </select>
          </div>
        </div>

      </form>
    </div>
  </div>

  <div class="card">
    <div class="card-body my-2">

      <div class="row">
        <div class="col-12 text-start">
          <h3>คลังสินค้า</h3>
          <p class="m-0">จำนวนซื้อ, จำนวนขายคิดหน่วยเป็น <span class="text-primary">กก. (กิโลกรัม)</span></p>
          <p>ยอดซื้อ, ยอดยายคิดหน่วยเป็น <span class="text-primary">บาท</span></p>
        </div>
      </div>

      <div class="row">
        <div class="col-4 text-start mb-3">
          <h6>รวมรายการซื้อ</h6>
          <p class="m-0">ยอดรวม: <span class="fw-bold">106,467.70</span> บาท</p>
          <p class="m-0">จำนวน: <span class="fw-bold">6</span> Transaction</p>
        </div>
        <div class="col-4 text-start mb-3">
          <h6>รวมรายการขาย</h6>
          <p class="m-0">ยอดรวม: <span class="fw-bold">0.00</span> บาท</p>
          <p class="m-0">จำนวน: <span class="fw-bold">0</span> Transaction</p>
        </div>
        <div class="col-4 text-start mb-3">
          <h6>คงเหลือ</h6>
          <p class="m-0">ยอดรวม: <span class="fw-bold">106,467.70</span> บาท</p>
        </div>
      </div>

      <table class="table table-bordered" v-if="dataItems.length > 0">
        <thead>
          <tr>
            <th>สินค้า</th>
            <th>ซื้อ</th>
            <th>ขาย</th>
            <th>คงเหลือ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedItems" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td class="text-end">
              <h6>นำนวน/บาท</h6>
              <p class="m-0 fw-bold">106,467.70</p>
              <p class="m-0"><span class="fw-bold">6</span> Transaction</p>
            </td>
            <td class="text-end">
              <h6>นำนวน/บาท</h6>
              <p class="m-0 fw-bold">106,467.70</p>
              <p class="m-0"><span class="fw-bold">6</span> Transaction</p>
            </td>
            <td class="text-end">
              <h6>นำนวน/บาท</h6>
              <p class="m-0 fw-bold">106,467.70</p>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="card-body bg-white mb-3">
        <h3>ไม่พบรายการสินค้า</h3>
      </div>

      <div class="d-flex justify-content-between">
        <div>
          แสดง {{ paginatedItems.length }} จาก {{ dataItems.length }} รายการ
        </div>
        <div>
          <button class="btn btn-secondary" @click="prevPage" :disabled="currentPage === 1">ก่อนหน้า</button>
          <span class="px-2">หน้า {{ currentPage }} จาก {{ totalPages }}</span>
          <button class="btn btn-secondary" @click="nextPage" :disabled="currentPage === totalPages">ถัดไป</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StockProduct',
  props: {},
  data() {
    return {
      today: this.formatDate(new Date()),
      dataSearch: {
        startDate: this.formatDate(new Date()),
        endDate: this.formatDate(new Date()),
        category: '',
        subCategory: '',
        search: '',
        firstPrice: '',
        lastPrice: '',
        grade: '',
      },
      dataItems: [],
      statusSearchText: false,
      currentPage: 1,
      itemsPerPage: 10,
    }
  },
  computed: {
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;

      return this.dataItems.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.dataItems.length / this.itemsPerPage);
    }
  },
  methods: {
    formatDate(date) {
      const newDate = new Date(date).toISOString().split('T')[0];

      return newDate;
    },
    searchData() {
      console.log(this.dataSearch);
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
  watch: {
    'dataSearch.startDate': function (val) {
      return this.formatDate(val);
    },
    'dataSearch.endDate': function (val) {
      return this.formatDate(val);
    },
    'dataSearch.search': function (val) {
      if (val.length > 0) {
        this.statusSearchText = true;
      } else {
        this.statusSearchText = false;
      }
    }
  }
}
</script>