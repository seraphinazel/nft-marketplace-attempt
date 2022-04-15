<template>
<div class="wrapper">
  <NavBar :wallet="account" @login="login" @logout="logOut"/>
  <router-view class="page"></router-view>
  <Footer/>
</div>
</template>

<script>
import Moralis from 'moralis';
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
      account: null,
    };
  },
  methods: {
    async login() {
      let user = Moralis.User.current();
      if (!user) {
      user = await Moralis.authenticate({ signingMessage: "Log in using Moralis" })
      .then((user) => {
        this.account = user.get('ethAddress');
        this.$store.commit('updateAccount', this.account);
      })
      .catch((error) => {
        console.log(error.message);
      });
      } else {
        this.account = user.get('ethAddress');
        this.$store.commit('updateAccount', this.account);
      }
    },
    async logOut() {
      await Moralis.User.logOut();
      this.account = null;
      this.$store.commit('updateAccount', this.account);
    },
  },
  mounted() {
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