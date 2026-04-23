<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Вход в систему</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label>Логин</label>
          <input v-model="formData.login" type="text" required />
        </div>
        <div class="form-group">
          <label>Пароль</label>
          <input v-model="formData.password" type="password" required />
        </div>
        <div v-if="error" class="error">{{ error }}</div>
        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  login: '',
  password: '',
});
const loading = ref(false);
const error = ref('');

async function login() {
  loading.value = true;
  error.value = '';
  
  try {
    await authStore.login(formData.value.login, formData.value.password);
    router.push('/organizations');
  } catch (err) {
    error.value = err.response?.data?.message || 'Ошибка входа';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}
.login-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  min-width: 350px;
}
.login-card h1 {
  margin-bottom: 20px;
  text-align: center;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.btn-primary {
  width: 100%;
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.error {
  color: red;
  margin-bottom: 15px;
  text-align: center;
}
</style>