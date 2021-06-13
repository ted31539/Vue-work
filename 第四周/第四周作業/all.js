import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from './pagination.js'
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
        apiPath: "ted31539",
        pagination:{}, 
    };
  },
  components: {
    pagination
  },
  methods: {
    getproductData(page =1) { //串獲得商品列表 API page =1 預設值
        const url = `${this.apiUrl}api/${this.apiPath}/admin/products?page=${page}`; 
        axios.get(url)
         .then((res) => {
             console.log(res);
             if (res.data.success) {
                this.products = res.data.products; //將資料 賦予到 data
                this.pagination = res.data.pagination; //取得分頁資訊
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

    updateProduct(tempProducts) { //新增或更新產品列表API
      const url = `${this.apiUrl}api/${this.apiPath}/admin/product`;
      if(this.isNew) { //如果是新增
      axios.post(url, {data: tempProducts})
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
        axios.put(`${url}/${tempProducts.id}`, {data: tempProducts})
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

    deleteProduct(tempProducts) { //刪除產品 API
      const url = `${this.apiUrl}api/${this.apiPath}/admin/product/${tempProducts.id}`;
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
  //  addImage() { //新增照片
  //    this.tempProducts.imagesUrl = [];  
  //  } 

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
//編輯or新增產品元件
app.component('productModal', {
  props: ['tempProducts'],
  methods:{
    addImage() { //新增照片
      this.tempProducts.imagesUrl = [];  
    }, 
  },
  template:`
  <div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
  aria-hidden="true">
<div class="modal-dialog modal-xl">
 <div class="modal-content border-0">
   <div class="modal-header bg-dark text-white">
     <h5 id="productModalLabel" class="modal-title">
       <span v-if="isNew">新增產品</span>
       <span v-else>編輯產品</span>
     </h5>
     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
   </div>
   <div class="modal-body">
     <div class="row">
       <div class="col-sm-4">
         <div class="form-group">
           <label for="imageUrl">主要圖片</label>
           <input type="text" class="form-control" placeholder="請輸入圖片連結" v-model="tempProducts.imageUrl">
           <img class="img-fluid" :src="tempProducts.imageUrl">
         </div>
         <div class="mb-1">多圖新增</div>
         <div v-if="Array.isArray(tempProducts.imagesUrl)">
           <div class="mb-1" v-for="(image, key) in tempProducts.imagesUrl" :key="key">
             <div class="form-group">
               <label for="imageUrl">圖片網址</label>
               <input type="text" class="form-control"
                 placeholder="請輸入圖片連結" v-model="tempProducts.imagesUrl[key]">
             </div>
             <img class="img-fluid" :src="tempProducts.imagesUrl[key]">
           </div>
           <div>
             <button type="button" class="btn btn-outline-primary btn-sm d-block w-100"
             @click="tempProducts.imagesUrl.push(tempProducts.imagesUrl[key])"
               
               >
               新增圖片
             </button>
           </div>
           <div>
             <button type="button" class="btn btn-outline-danger btn-sm d-block w-100"
             @click="tempProducts.imagesUrl.pop()"
               >
               刪除圖片
             </button>
           </div>
         </div>
         <div v-else>
           <button type="button" class="btn btn-outline-primary btn-sm d-block w-100" @click="addImage"
            
             >
             新增陣列圖片
           </button>
         </div>
       </div>
       
       <div class="col-sm-8">
         <div class="form-group">
           <label for="title">標題</label>
           <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model="tempProducts.title">
         </div>

         <div class="row">
           <div class="form-group col-md-6">
             <label for="category">分類</label>
             <input id="category" type="text" class="form-control"
                    placeholder="請輸入分類" v-model="tempProducts.category">
           </div>
           <div class="form-group col-md-6">
             <label for="price">單位</label>
             <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model="tempProducts.unit">
           </div>
         </div>

         <div class="row">
           <div class="form-group col-md-6">
             <label for="origin_price">原價</label>
             <input id="origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價" v-model.number="tempProducts.origin_price">
           </div>
           <div class="form-group col-md-6">
             <label for="price">售價</label>
             <input id="price" type="number" min="0" class="form-control"
                    placeholder="請輸入售價" v-model.number="tempProducts.price">
           </div>
         </div>
         <hr>

         <div class="form-group">
           <label for="description">產品描述</label>
           <textarea id="description" type="text" class="form-control"
                     placeholder="請輸入產品描述" v-model="tempProducts.description">
           </textarea>
         </div>
         <div class="form-group">
           <label for="content">說明內容</label>
           <textarea id="description" type="text" class="form-control"
                     placeholder="請輸入說明內容" v-model="tempProducts.content">
           </textarea>
         </div>
         <div class="form-group">
           <div class="form-check">
             <input id="is_enabled" class="form-check-input" type="checkbox"
                    :true-value="1" :false-value="0" v-model="tempProducts.is_enabled">
             <label class="form-check-label" for="is_enabled">是否啟用</label>
           </div>
         </div>
       </div>
     </div>
   </div>
   <div class="modal-footer">
     <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
       取消
     </button>
     <button type="button" class="btn btn-primary" @click="$emit('updateProduct', tempProducts)">
       確認
     </button>
   </div>
 </div>
</div>
</div>`
})
//刪除產品元件
app.component('delProductModal', {
  props:['tempProducts'],
  template:`
  <div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
  aria-labelledby="delProductModalLabel" aria-hidden="true">
<div class="modal-dialog">
 <div class="modal-content border-0">
   <div class="modal-header bg-danger text-white">
     <h5 id="delProductModalLabel" class="modal-title">
       <span>刪除產品</span>
     </h5>
     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
   </div>
   <div class="modal-body">
     是否刪除
     <strong class="text-danger"></strong> 商品(刪除後將無法恢復)。
   </div>
   <div class="modal-footer">
     <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
       取消
     </button>
     <button type="button" class="btn btn-danger" @click="$emit('deleteProduct', tempProducts)">
       確認刪除
     </button>
   </div>
 </div>
</div>
</div>`
})
app.mount('#app');

