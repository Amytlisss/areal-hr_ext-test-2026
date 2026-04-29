<template>
  <div class="history-page">
    <h1>История изменений</h1>

    <div class="filters">
      <input 
        v-model="employeeId" 
        placeholder="ID сотрудника (опционально)" 
        @input="fetchHistory"
        class="filter-input"
      />
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <table v-if="!loading && list.length > 0" class="data-table">
      <thead>
        <tr>
          <th>Дата</th>
          <th>Пользователь</th>
          <th>Объект</th>
          <th>Поле</th>
          <th>Было</th>
          <th>Стало</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <td>{{ formatDate(item.createdAt) }}</td>
          <td>{{ item.user?.login || '—' }}</td>
          <td>{{ item.objectType }}</td>
          <td>{{ item.fieldName }}</td>
          <td>{{ item.oldValue || '—' }}</td>
          <td>{{ item.newValue || '—' }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else-if="!loading && list.length === 0" class="empty">
      Нет записей истории
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/index';

const list = ref([]);
const loading = ref(false);
const error = ref(null);
const employeeId = ref('');

onMounted(() => {
  fetchHistory();
});

async function fetchHistory() {
  loading.value = true;
  try {
    const url = employeeId.value 
      ? `/operation-history?employeeId=${employeeId.value}`
      : '/operation-history';
    const response = await api.get(url);
    list.value = response.data;
  } catch (err) {
    error.value = err.response?.data?.message || err.message;
  } finally {
    loading.value = false;
  }
}

function formatDate(dateString) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString('ru-RU');
}
</script>

<style scoped>
.history-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}
.filters {
  margin-bottom: 20px;
}
.filter-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table th, .data-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.data-table th {
  background-color: #f2f2f2;
}
.loading, .error, .empty {
  text-align: center;
  padding: 40px;
}
.error {
  color: red;
}
</style>