<template>
  <div>{{item}}</div>
</template>

<script>
export default {
  data() {
    return {
      item: {},
    };
  },
  methods: {
    getItem() {
      this.item = this.$store.state.offers.find(element => element.tokenId == this.$route.params.id);
    },
  },
  created() {
    this.getItem();
  },
};
</script>
