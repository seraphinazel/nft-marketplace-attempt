<template>
  <div class="nav">
    <div>
      <router-link to='/'>Logo</router-link>
    </div>
    <div>
      <input type="text" placeholder="Search...">
    </div>
    <div>
      <div class="nav__btns">
        <router-link to='/about' class="nav_link">About</router-link>
        <router-link to='/account' class="nav_link">Account</router-link>
      </div>
    </div>
    <div v-if="wallet !== null">
      Wallet address: {{wallet}}
      <button @click="$emit('logout')">Выйти</button>
    </div>
    <div v-else>
      <button @click="$emit('login')">Войти</button>
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
.nav_link {
  margin: 15px;
}
</style>