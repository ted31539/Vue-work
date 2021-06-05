import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js'; //載入creatApp 

const app = createApp({
  data() {
    return { 
        data: {
            "username": "",
            "password": ""
        },
        apiUrl: "https://vue3-course-api.hexschool.io/",
        apiPath: "ted31539"               
    };
  },
  methods: {
    login() {
      axios.post(`${this.apiUrl}admin/signin`, this.data)
        .then((res) => {
          console.log(res);
          if(res.data.success){
            const {token, expired} = res.data;
            console.log(token, expired);
            document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
            window.location = 'index.html';                    
          }else {
            console.log(res.data.message);
          }
        }).catch((err) => {
          console.log(err);
        });
    }    
  },
  mounted() {           

  },
});
app.mount('#app');
