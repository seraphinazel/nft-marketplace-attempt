<template>
  <ul class="catalog__pagination" v-show="pages > 1">
    <li class="pagination__item">
      <a href="#" class="pagination__link pagination__link--arrow left" :class="{'pagination__link--disabled': modelValue === 1}" aria-label="Предыдущая страница" @click.prevent="prevPage(modelValue)">
      </a>
    </li>
    <li class="pagination__item" v-for="pageNumber in pages" :key="pageNumber">
       <a href="#" class="pagination__link" :class="{'pagination__link--current': pageNumber === modelValue}" @click.prevent="paginate(pageNumber)">
          {{ pageNumber }}
       </a>
     </li>
    <li class="pagination__item">
      <a href="#" class="pagination__link pagination__link--arrow right" :class="{'pagination__link--disabled': modelValue >= pages}" aria-label="Следующая страница" @click.prevent="nextPage(modelValue)">
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['modelValue', 'count', 'perPage'],
  computed: {
    pages() {
      return Math.ceil(this.count / this.perPage);
    },
  },
  methods: {
    paginate(page) {
      this.$emit('update:modelValue', page);
    },
    nextPage(page) {
      if (page < this.pages) {
        this.$emit('update:modelValue', page + 1);
      }
    },
    prevPage(page) {
      if (page > 1) {
        this.$emit('update:modelValue', page - 1);
      }
    },
  },
};
</script>

<style scoped>
.catalog__pagination {
  width: 200px;
  margin: 0 auto;
  margin-bottom: auto;
  display: flex;
  justify-content: space-between;
}
.pagination__item {
  list-style-type: none;
  margin: 10px;
  padding: 10px;
}
.pagination__link {
  text-decoration: none;
  display: block;
  width: 20px;
  height: 20px;
}
.pagination__link--arrow{
  border-left: 1px solid black;
  border-bottom: 1px solid black;
}
.pagination__link--arrow.left {
  transform: rotate(45deg);
}
.pagination__link--arrow.right {
  transform: rotate(225deg);
}
.pagination__link--disabled {
  pointer-events: none;
  cursor: not-allowed;
}
</style>