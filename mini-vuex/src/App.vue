<script setup>

</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <h1>mini-vuex</h1>
    <button @click="$store.commit('add')">count:{{$store.state.count}}</button>
    <button @click="$store.dispatch('add')">async:{{$store.state.count}}</button>
    <p>doubleCounter:{{ $store.getters.doubleCouter }}</p>
  </div>

</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
