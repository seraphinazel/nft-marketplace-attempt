<template>
  <div @click="$router.push(`/item/${item.offerId}`)" class="item">
    <h3>Offer ID {{item.offerId}}</h3>
    <div>tokenID: {{ item.tokenId }}</div>
    <div>Name: {{ item.name }}</div>
    <div>Fandom: {{ item.fandom }}</div>
    <div>
      <img style="width:150px;" :src="item.picture" :alt="item.picture"/>
    </div>
    <div>Цена (BNB): {{ item.price * (10 ** (-18)) }}</div>
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
  border: 2px solid teal;
  border-radius: 10px;
  margin: 15px 15px 15px 0;
  padding: 15px;
  box-shadow: 2px 2px 0 2px rgba(0, 0, 0, 0.2);
  background-color: rgb(211, 243, 211);
}
</style>