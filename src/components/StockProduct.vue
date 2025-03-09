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
              <option v-for="category in categoryItems" :key="category.categoryId" :value="category.categoryId">{{ category.categoryName }}</option>
            </select>
          </div>
          <div class="col-2">
            <label for="subCategory">เลือกหมวดหมู่สินค้าย่อย</label>
            <select id="subCategory" v-model="dataSearch.subCategory" class="form-control" :disabled="statusSearchText || subCategoryItems.length == 0">
              <option value="">เลือกหมวดหมู่สินค้าย่อย</option>
              <option v-for="subCategory in subCategoryItems" :key="subCategory.subCategoryId" :value="subCategory.subCategoryId">{{ subCategory.subCategoryName }}</option>
            </select>
          </div>
          <div class="col-2">
            <label for="search"></label>
            <input type="text" id="search" v-model="dataSearch.searchOrderId" class="form-control" placeholder="ค้นหา ออเดอร์ ID"
              :disabled="statusSearchText">
          </div>
          <div class="col-2">
            <div class="row">
              <div class="col-6">
                <button type="submit" class="btn btn-blue-custom mt-4 w-100">
                  <i class="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
              <div class="col-6">
                <button type="button" class="btn btn-danger mt-4 w-100" @click="clearDataSearch" :disabled="statusSearchText">
                  <i class="fa-solid fa-rotate-right"></i>
                </button>
              </div>
            </div>
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
            <input type="number" id="lastPrice" v-model="dataSearch.lastPrice" @change="validateLastPrice()" class="form-control"
              placeholder="ราคาสุดท้าย" :disabled="statusSearchText || dataSearch.firstPrice == ''">
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
          <p>ยอดซื้อ, ยอดขายคิดหน่วยเป็น <span class="text-primary">บาท</span></p>
        </div>
      </div>

      <div class="row">
        <div class="col-4 text-start mb-3">
          <h6>รวมรายการซื้อ</h6>
          <p class="m-0">ยอดรวม: <span class="fw-bold">{{ formatNumber(buyTotalAmount) }}</span> บาท</p>
          <p class="m-0">จำนวน: <span class="fw-bold">{{ buyTotalQuantity }}</span></p>
          <p class="m-0"><span class="fw-bold">{{ buyTotalTransaction }}</span> Transaction</p>
        </div>
        <div class="col-4 text-start mb-3">
          <h6>รวมรายการขาย</h6>
          <p class="m-0">ยอดรวม: <span class="fw-bold">{{ formatNumber(sellTotalAmount) }}</span> บาท</p>
          <p class="m-0">จำนวน: <span class="fw-bold">{{ sellTotalQuantity }}</span></p>
          <p class="m-0"><span class="fw-bold">{{ sellTotalTransaction }}</span> Transaction</p>
        </div>
        <div class="col-4 text-start mb-3">
          <h6>คงเหลือ</h6>
          <p class="m-0">ยอดรวม: <span class="fw-bold">{{ formatNumber(buyTotalAmount - sellTotalAmount) }}</span> บาท</p>
          <p class="m-0">จำนวน: <span class="fw-bold">{{ formatNumber(buyTotalQuantity - sellTotalQuantity) }}</span></p>
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
          <tr v-for="(item, index) in paginatedItems" :key="index">
            <td class="text-start">{{ item.categoryName }}</td>
            <td class="text-end" v-for="list, index in item.buy" :key="index">
              <h6>จำนวน/บาท</h6>
              <p class="m-0 fw-bold">{{ formatNumber(list.price) }}</p>
              <p class="m-0"><span class="fw-bold">{{ formatNumber(list.quantity) }}</span> กก.</p>
            </td>
            <td class="text-end" v-for="list, index in item.sell" :key="index">
              <h6>จำนวน/บาท</h6>
              <p class="m-0 fw-bold">{{ formatNumber(list.price) }}</p>
              <p class="m-0"><span class="fw-bold">{{ formatNumber(list.quantity) }}</span> กก.</p>
            </td>
            <td class="text-end">
              <h6>จำนวน/บาท</h6>
              <p class="m-0 fw-bold">{{ formatNumber(item.differenceAmount) }}</p>
              <p class="m-0"><span class="fw-bold">{{ formatNumber(item.differenceQuantity) }}</span> กก.</p>
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
import api from '../api/stock';

export default {
  name: 'StockProduct',
  props: {},
  data() {
    return {
      today: this.formatDate(new Date()),
      dataSearch: {
        startDate: '',
        endDate: '',
        category: '',
        subCategory: '',
        firstPrice: '',
        lastPrice: '',
        grade: '',
        searchOrderId: '',
      },
      buyTotalAmount: 0,
      buyTotalQuantity: 0,
      buyTotalTransaction: 0,
      sellTotalAmount: 0,
      sellTotalQuantity: 0,
      sellTotalTransaction: 0,
      dataItems: [],
      categoryItems: [],
      subCategoryItems: [],
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
    async getCategory() {
      try {
        const res = await api.getCategory();
        this.categoryItems = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    formatDate(date) { 
      const newDate = new Date(date).toISOString().split('T')[0];

      return newDate;
    },
    formatNumber(number) {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
    },
    async searchData() {
      if (this.dataSearch.startDate != '') {
        if (this.dataSearch.endDate == '') {
          alert('หากเลือกวันที่เริ่มต้น กรุณาเลือกวันที่สิ้นสุด');
          return;
        }
      }

      const response = await api.getStock(this.dataSearch);
      this.dataItems = response.data.searchDatas;
      this.buyTotalAmount = response.data.buyTotalAmount;
      this.buyTotalQuantity = response.data.buyTotalQuantity;
      this.buyTotalTransaction = response.data.buyTotalTransaction;
      this.sellTotalAmount = response.data.sellTotalAmount;
      this.sellTotalQuantity = response.data.sellTotalQuantity;
      this.sellTotalTransaction = response.data.sellTotalTransaction;
    },
    validateLastPrice() {
      if (this.dataSearch.lastPrice != '' && Number(this.dataSearch.firstPrice) > Number(this.dataSearch.lastPrice)) {
        alert('ราคาสุดท้ายต้องมากกว่าราคาเริ่มต้น');
        this.dataSearch.lastPrice = this.dataSearch.firstPrice;
      }
    },
    clearDataSearch() {
      this.dataSearch = {
        startDate: '',
        endDate: '',
        category: '',
        subCategory: '',
        firstPrice: '',
        lastPrice: '',
        grade: '',
        searchOrderId: '',
      }
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
      if (val != '') {
        return this.formatDate(val);
      }
    },
    'dataSearch.endDate': function (val) {
      if (val != '') {
        return this.formatDate(val);
      }
    },
    'dataSearch.search': function (val) {
      if (val.length > 0) {
        this.statusSearchText = true;
      } else {
        this.statusSearchText = false;
      }
    },
    'dataSearch.category': async function (val) {
      if (val != "") {
        const subCategoryItems = await this.categoryItems.find(item => item.categoryId === val);
        this.subCategoryItems = subCategoryItems.subcategory || [];
      } else {
        this.subCategoryItems = [];
        this.searchData.subCategory = '';
      }
    },
    'dataSearch.firstPrice': function (val) {
      if (val == '') {
        this.dataSearch.lastPrice = '';
      }
    },
  },
  mounted() {
    this.getCategory();
  }
}
</script>