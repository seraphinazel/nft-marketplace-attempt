<template>
<div class="wrapper">
  <NavBar :wallet="account"/>
  <router-view class="page"></router-view>
  <Footer/>
</div>
</template>

<script>
import { mapActions } from 'vuex';
import network from '@/util/constants/network';
import NavBar from '@/components/UI/NavBar.vue';
import Footer from '@/components/UI/Footer.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    Footer
  },
  data() {
    return {
    };
  },
  computed: {
    account() {
      return this.$store.state.data.account !== null ? this.$store.state.data.account[0] : null;
    },
    chainId() {
      return this.$store.state.data.chainId !== null ? this.$store.state.data.chainId : 0; //если chainId не совпадает с нашей сетью - сообщение о переподключении к нужной сети
    },
    network() {
      return network;
    },
    isConnected() {
      return this.$store.state.isConnected;
    },
  },
  methods: {
    ...mapActions(['getConnect']),
  },
  mounted() {
    setTimeout(() => {
      this.getConnect();
    }, 0);
  },
};
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  height: 100%;
}
.wrapper {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.page {
  flex: 1 1 auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>