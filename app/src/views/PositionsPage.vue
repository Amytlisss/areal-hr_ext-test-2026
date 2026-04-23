<template>
  <div class="positions-page">
    <div class="header">
      <h1>Должности</h1>
      <button @click="openCreateDialog" class="btn-primary">+ Добавить должность</button>
    </div>

    <!-- Поиск -->
    <div class="search-bar">
      <input 
        v-model="searchQuery" 
        placeholder="Поиск по названию..." 
        @input="handleSearch"
        class="search-input"
      />
    </div>

    <div v-if="store.loading" class="loading">Загрузка...</div>
    <div v-if="store.error" class="error">{{ store.error }}</div>

    <table v-if="!store.loading && store.list.length > 0" class="data-table">
      <thead>
        <tr>
          <th>Наименование</th>
          <th>Дата создания</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in store.list" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ formatDate(item.createdAt) }}</td>
          <td>
            <button @click="openEditDialog(item)" class="btn-edit">✏️</button>
            <button @click="confirmDelete(item)" class="btn-delete">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else-if="!store.loading && store.list.length === 0" class="empty">
      Нет должностей. Добавьте первую!
    </div>

    <!-- Модальное окно -->
    <div v-if="dialogVisible" class="modal" @click.self="dialogVisible = false">
      <div class="modal-content">
        <h2>{{ isEdit ? 'Редактировать должность' : 'Новая должность' }}</h2>
        <form @submit.prevent="save">
          <div class="form-group">
            <label>Наименование *</label>
            <input v-model="formData.name" required />
          </div>
          <div class="modal-actions">
            <button type="button" @click="dialogVisible = false" class="btn-secondary">Отмена</button>
            <button type="submit" class="btn-primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePositionsStore } from '../stores/positions';

const store = usePositionsStore();

const dialogVisible = ref(false);
const isEdit = ref(false);
const formData = ref({ name: '' });
const selectedId = ref(null);
const searchQuery = ref('');
let searchTimeout = null;

onMounted(() => {
  store.fetchAll();
});

function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
}

function handleSearch() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    store.fetchAll(searchQuery.value);
  }, 300);
}

function openCreateDialog() {
  isEdit.value = false;
  formData.value = { name: '' };
  selectedId.value = null;
  dialogVisible.value = true;
}

function openEditDialog(item) {
  isEdit.value = true;
  formData.value = { name: item.name };
  selectedId.value = item.id;
  dialogVisible.value = true;
}

async function save() {
  try {
    if (isEdit.value) {
      await store.update(selectedId.value, formData.value);
    } else {
      await store.create(formData.value);
    }
    dialogVisible.value = false;
  } catch (err) {
    alert('Ошибка: ' + (err.response?.data?.message || err.message));
  }
}

function confirmDelete(item) {
  if (confirm(`Удалить должность "${item.name}"?`)) {
    store.delete(item.id);
  }
}
</script>

<style scoped>
.positions-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.search-bar {
  margin-bottom: 20px;
}
.search-input {
  width: 100%;
  max-width: 300px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.btn-primary {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-edit, .btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  margin-right: 8px;
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
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 400px;
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
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.btn-secondary {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>