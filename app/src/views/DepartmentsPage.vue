<template>
  <div class="departments-page">
    <div class="header">
      <h1>Отделы</h1>
      <button @click="openCreateDialog" class="btn-primary">+ Добавить отдел</button>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <table v-if="!loading && list.length > 0" class="data-table">
      <thead>
        <tr>
          <th>Наименование</th>
          <th>Организация</th>
          <th>Комментарий</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.organization?.name || '—' }}</td>
          <td>{{ item.comment || '—' }}</td>
          <td>
            <button @click="openEditDialog(item)" class="btn-edit">ред</button>
            <button @click="confirmDelete(item)" class="btn-delete">удалить</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else-if="!loading && list.length === 0" class="empty">
      Нет отделов. Добавьте первый!
    </div>

    <div v-if="dialogVisible" class="modal" @click.self="dialogVisible = false">
      <div class="modal-content">
        <h2>{{ isEdit ? 'Редактировать отдел' : 'Новый отдел' }}</h2>
        <form @submit.prevent="save">
          <div class="form-group">
            <label>Наименование *</label>
            <input v-model="formData.name" required />
          </div>
          <div class="form-group">
            <label>Организация *</label>
            <select v-model="formData.organizationId" required>
              <option :value="null">Выберите организацию</option>
              <option v-for="org in organizations" :key="org.id" :value="org.id">
                {{ org.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Комментарий</label>
            <textarea v-model="formData.comment" rows="3"></textarea>
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
import { useDepartmentsStore } from '../stores/departments';
import { useOrganizationsStore } from '../stores/organizations';
import { storeToRefs } from 'pinia';

const departmentsStore = useDepartmentsStore();
const organizationsStore = useOrganizationsStore();

const { list, loading, error } = storeToRefs(departmentsStore);
const organizations = ref([]);

const dialogVisible = ref(false);
const isEdit = ref(false);
const formData = ref({
  name: '',
  organizationId: null,
  comment: '',
});
const selectedId = ref(null);
const searchQuery = ref('');
let searchTimeout = null;

onMounted(async () => {
  await departmentsStore.fetchAll();
  await organizationsStore.fetchAll();
  organizations.value = organizationsStore.list;
});

function handleSearch() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    departmentsStore.fetchAll(searchQuery.value);
  }, 300);
}

function openCreateDialog() {
  isEdit.value = false;
  formData.value = { name: '', organizationId: null, comment: '' };
  selectedId.value = null;
  dialogVisible.value = true;
}

function openEditDialog(item) {
  isEdit.value = true;
  formData.value = {
    name: item.name,
    organizationId: item.organizationId,
    comment: item.comment || '',
  };
  selectedId.value = item.id;
  dialogVisible.value = true;
}

async function save() {
  try {
    if (isEdit.value) {
      await departmentsStore.update(selectedId.value, formData.value);
    } else {
      await departmentsStore.create(formData.value);
    }
    dialogVisible.value = false;
    await departmentsStore.fetchAll();
  } catch (err) {
    alert('Ошибка: ' + (err.response?.data?.message || err.message));
  }
}

function confirmDelete(item) {
  if (confirm(`Удалить отдел "${item.name}"?`)) {
    departmentsStore.delete(item.id);
  }
}
</script>

<style scoped>
.departments-page {
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
.btn-primary {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary:hover {
  background-color: #369f6e;
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
.form-group input,
.form-group select,
.form-group textarea {
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