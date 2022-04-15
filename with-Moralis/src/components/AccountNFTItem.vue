<template>
  <div>
    <div>tokenID: {{item.token_id}}</div>
    <div>{{item.name}}</div>
    <div>Creator: {{item.creator}}</div>
    <div><b>offerID: {{item.offerId}}</b></div>
    <div style="overflow:hidden;">{{item.token_uri}}</div>
    <div v-if="item.isApproved === true" style="background-color:lightgreen;">Approved</div>
    <div v-else>
      <button @click="$emit('approveItem', item.token_id)">Approve</button>
    </div>
    <div v-if="item.active === true" style="background-color:lightgreen;">
      NFT уже выставлен на маркетплейсе
      <button @click="$router.push(`/item/${item.offerId}`)">Посмотреть</button>
    </div>
    <div v-else-if="item.isApproved === true">
      <input type="text" v-model="offerPrice" placeholder="Price"/>
      <input type="number" v-model="royalty" placeholder="Royalty %" v-if="isOwner === true"/>
      <button @click="createOffer">Выставить на продажу</button>
    </div>
  </div>
</template>

<script>
export default{
  props: {
    item: {
      type: Object,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      offerPrice: null,
      royalty: null,
      isOwner: false,
    };
  },
  methods: {
    createOffer() {
      this.$emit('createOffer', this.item.token_id, this.offerPrice.toString(), this.royalty !== null ? this.royalty : 0);
      this.offerPrice = null;
      this.royalty = null;
    },
  },
  mounted() {
    setTimeout(() => {
      this.user == this.item.creator ? this.isOwner = true : this.isOwner = false;
    }, 3000);
  },
  watch: {
    user() {
      setTimeout(() => {
        this.user == this.item.creator ? this.isOwner = true : this.isOwner = false;
      }, 3000);
    },
  },
};
</script>
