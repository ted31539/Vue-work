import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
// bootstrap Modal 先全域宣告
let productModal = {};
let delProductModal = {};

const app = createApp({
  data() {
    return { 
        products: [], //接API資料
        tempProducts: { //編輯暫存用
            // imagesUrl: []  
        },
        isNew: false, //判斷是新增或是編輯
        apiUrl: "https://vue3-course-api.hexschool.io/",
        apiPath: "ted31539" 
    };
  },
  methods: {
    getproductData() { //串獲得商品列表 API
        const url = `${this.apiUrl}api/${this.apiPath}/admin/products`; 
        axios.get(url)
         .then((res) => {
             console.log(res);
             if (res.data.success) {
                this.products = res.data.products; //將資料 賦予到 data
             }else if (!res.data.success) {
                console.log("登入錯誤");
             }             
         })
         .catch((err) => {
             console.log(err);
         })
    },
    openModal(status, item) { //打開模組
        if(status === "new") { // 建立新產品
          this.isNew = true;
          this.tempProducts = {}; //tempProduct先清空
          productModal.show();        
        }else if(status === "edit") { //編輯產品
          this.isNew = false;
          this.tempProducts = {...item}; // v-for 的陣列資料 賦予到 tempProduct 以淺層拷貝方式
          productModal.show();
        }
        else if(status === "delete"){ //刪除產品
          this.tempProducts = {...item}; //v-for 的陣列資料 賦予到 tempProduct 以淺層拷貝方式
          delProductModal.show();
        }            
    },

    updateProduct() { //新增或更新產品列表API
      const url = `${this.apiUrl}api/${this.apiPath}/admin/product`;
      if(this.isNew) { //如果是新增
      axios.post(url, {data: this.tempProducts})
       .then((res) => {
         console.log(res);
          if(res.data.success) {
            alert(res.data.message);
            this.getproductData();
          }else if(!res.data.success) {
             console.log("錯誤");
          }             
      })
       .catch((err) => {
          console.log(err);
       })
      }
      else if(!this.isNew) { //如果是編輯
        axios.put(`${url}/${this.tempProducts.id}`, {data: this.tempProducts})
         .then((res) => {
          console.log(res);
          if(res.data.success) {
            alert(res.data.message);
            this.getproductData();
          }else if(!res.data.success) {
             console.log("錯誤");
          }             
        })
        .catch((err) => {
          console.log(err);
        })
      }
      productModal.hide(); //關閉模組
    },

    deleteProduct() { //刪除產品 API
      const url = `${this.apiUrl}api/${this.apiPath}/admin/product/${this.tempProducts.id}`;
      axios.delete(url)
      .then((res) => {
       console.log(res);
       if(res.data.success) {
         alert(res.data.message);
         this.getproductData();
       }else if (!res.data.success) {
          console.log("錯誤");
       }             
     })
     .catch((err) => {
       console.log(err);
     })
     delProductModal.hide();
   },
   addImage() { //新增照片
     this.tempProducts.imagesUrl = [];  
   } 

  },
  mounted() {
     // 取出 Token 到cookie
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');    
      axios.defaults.headers.common['Authorization'] = token; //放入Header
     //bootstrap Modal 建立實體      
      productModal = new bootstrap.Modal(document.getElementById('productModal'));
      delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
      this.getproductData();
  },
  
});
app.mount('#app');

