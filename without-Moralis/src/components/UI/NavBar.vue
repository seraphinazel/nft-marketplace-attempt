<template>
  <div class="nav">
    <div>
      <router-link to='/'>Logo</router-link>
    </div>
    <div>
      <input type="text" placeholder="Search...">
    </div>
    <div class="nav__btns">
      <router-link to='/about'>About</router-link>
      <router-link to='/account'>Account</router-link>
      <div>Wallet address: {{wallet}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    wallet: {
      type: String
    },
  },
};
</script>

<style scoped>
.nav {
  display: flex;
  justify-content: space-between;
  background-color: azure;
  height: 50px;
  box-shadow: 2px 1px 4px gray;
  padding: 15px;
}
.nav__btns {
  display: flex;
  justify-content: space-between;
}
</style>