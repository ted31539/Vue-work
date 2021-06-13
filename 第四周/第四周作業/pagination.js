export default {
        props: ['page'],
        template:`<nav aria-label="Page navigation example">
        <!--  前一頁 -->
        <ul class="pagination">
          <li class="page-item" :class="{'disabled': !page.has_pre}"> <!--  前一頁激活判斷 :class={ 'class名稱' : 判斷式  }-->
            <a class="page-link" href="#" aria-label="Previous"
            @click="$emit('get-product', page.current_page -1)">        
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <!--  目前頁面 -->
          <li class="page-item" 
            :class="{ 'active': item === page.current_page}"
            v-for="item in page.total_pages" :key="item.id">
          <a class="page-link" href="#" @click="$emit('get-product', item)">
          {{ item }}
          </a>
          </li>
          <!--  下一頁 -->
          <li class="page-item" :class="{'disabled': !page.has_next}"><!--  下一頁激活判斷 -->
            <a class="page-link" href="#" aria-label="Next"
            @click="$emit('get-product', page.current_page +1)">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>`
}