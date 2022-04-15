<template>
  <div class="list_wrapper">
    <div v-for="item in items" :key="item.tokenId" class="list_item">
      <NFTItem :item="item"/>
      <button
        @click="$emit('buyItem', item.offerId, item.price)"
      >
        Купить
      </button>
      <button
        @click="$emit('closeOffer', item.offerId)"
        v-if="item.owner.toLowerCase() === user"
      >
        Убрать
      </button>
    </div>
  </div>
</template>

<script>
import NFTItem from '@/components/NFTItem.vue';

export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  components: { NFTItem },
  computed: {
    user() {
      return this.$store.state.account;
    },
  },
};
</script>

<style scoped>
.list_wrapper {
  display: flex;
  flex-wrap: wrap;
  padding: 15px;
}
.list_item {
  flex: 0 0 33%;
}
.list_item>button {
  display: block;
  margin-bottom: 20px;
  width: 100px;
  height: 40px;
  font-size: 18px;
  font-weight: bold;
  line-height: 40px;
  color: #fff;
  background-color: lightblue;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 2px 2px 0 2px gray;
}
.list_item>button:active {
  box-shadow: 1px 1px 0 1px gray;
  position: relative;
  left: 1px;
  bottom: 1px;
}
</style>