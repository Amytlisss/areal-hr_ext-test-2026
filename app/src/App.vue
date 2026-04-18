<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/organizations">Организации</router-link>
      <router-link to="/departments">Отделы</router-link>
      <router-link to="/positions">Должности</router-link>
      <router-link to="/employees">Сотрудники</router-link>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
}
.navbar {
  background-color: #2c3e50;
  padding: 15px 20px;
  display: flex;
  gap: 20px;
}
.navbar a {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
}
.navbar a:hover {
  background-color: #42b983;
}
.navbar a.router-link-active {
  background-color: #42b983;
}
main {
  padding: 20px;
}
</style>