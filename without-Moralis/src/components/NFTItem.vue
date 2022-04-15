<template>
  <div @click="$router.push(`/item/${item.tokenId}`,)" class="item" :class="`${item.closed === true ? 'closed' : 'available'}`">
    <div>tokenID: {{ item.tokenId }}</div>
    <div>Цена (в WEI): {{ item.price }}</div>
    <div>{{ item.closed ? 'Продано' : 'Можно купить' }}</div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.item {
  display: flex;
  flex-direction: column;
  font-size: 20px;
  border: 2px solid lightblue;
  border-radius: 10px;
  margin: 15px 15px 15px 0;
  box-shadow: 2px 2px 0 2px rgba(0, 0, 0, 0.2);
}
.item>div {
  padding: 15px;
}
.closed {
  background-color: lightgray;
  color: grey;
}
.available {
  background-color: rgb(211, 243, 211);
}
</style>