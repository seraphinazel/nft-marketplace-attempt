<template>
  <div class="item_page__wrapper">
    <div class="item_page_element img"><img :src="item.picture"/></div>
    <div class="item_page_element descr">
      <h4>Offer ID {{item.offerId}}</h4>
      <ul>
        <li>Название: {{item.name}}</li>
        <li>TokenID: {{item.tokenId}}</li>
        <li>Author: {{item.creator}}</li>
        <li>Fandom: {{item.fandom}}</li>
        <li>Владелец: {{item.owner}}</li>
        <li>Цена: {{item.price * (10 ** (-18))}} BNB</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Moralis from 'moralis';

export default {
  data() {
    return {
      item: {},
    };
  },
  methods: {
    async getItem() {
      const query = new Moralis.Query('Offer');
      query.equalTo('offerId', +this.$route.params.id);
      const result = await query.find();
      let offer = result[0];
      offer.price = offer.get('price');
      offer.active = offer.get('active');
      offer.owner = offer.get('owner');
      offer.tokenId = offer.get('tokenId');
      offer.name = offer.get('name');
      offer.fandom = offer.get('fandom');
      offer.creator = offer.get('creator');
      offer.picture = offer.get('picture');
      offer.offerId = offer.get('offerId');
      this.item = offer;
    },
  },
  created() {
    this.getItem();
  },
};
</script>

<style scoped>
.item_page__wrapper {
  margin: 50px;
  padding: 30px;
  flex-direction: row;
  border: 2px solid lightcoral;
  border-radius: 10px;
  box-shadow: 2px 2px 0 2px gray;
}
.item_page_element {
  padding: 20px;
  font-size: 18px;
}
li {
  list-style-type: none;
  margin: 0 0 15px 0;
}
</style>