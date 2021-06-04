
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let productModal = {};

const app = createApp({
  data() {
    return { 
        products: [],
        tempProducts: {
            imagesUrl: [
                
              ]
        },
        apiUrl: "https://vue3-course-api.hexschool.io/",
        apiPath: "ted31539" 
      
// content:"測試的說明"
// description:"測試的描述"
// id:"-Mb72i9gWJ_l1c-gpuWv"
// imageUrl:"https://images.unsplash.com/photo-1516550135131-fe3dcb0bedc7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=621e8231a4e714c2e85f5acbbcc6a730&auto=format&fit=crop&w=1352&q=80"
// imagesUrl:Array[5]
// is_enabled:1
// num:1
// origin_price:1000
// price:500
// title:"測試的產品"
// unit:"單位"
            
    };
  },
  methods: {
    getproductData() {
        const url = `${this.apiUrl}api/${this.apiPath}/admin/products`; 
        axios.get(url)
         .then((res) => {
             console.log(res);
             if (res.data.success) {
                this.products = res.data.products;
             }else if (!res.data.success) {
                console.log("登入錯誤");
             }             
         })
         .catch((err) => {
             console.log(err);
         })
    },
    openModal() {
        this.tempProducts = {
            imagesUrl: [
                
              ]
        };
        productModal.show();
    
      }

  },
  mounted() {
     // 取出 Token
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');    
      axios.defaults.headers.common['Authorization'] = token;
      
      productModal = new bootstrap.Modal(document.getElementById('productModal'));
      this.getproductData();
  },
  
});
app.mount('#app');

