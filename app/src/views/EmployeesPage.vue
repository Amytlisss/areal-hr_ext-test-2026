<template>
  <div class="employees-page">
    <div class="header">
      <h1>Сотрудники</h1>
      <button @click="openCreateDialog" class="btn-primary">+ Добавить сотрудника</button>
    </div>

    <!-- Фильтры -->
    <div class="filters">
      <input 
        v-model="filters.search" 
        placeholder="Поиск по фамилии..." 
        @input="handleSearch"
        class="filter-input"
      />
      <select v-model="filters.departmentId" @change="applyFilters" class="filter-select">
        <option :value="null">Все отделы</option>
        <option v-for="dept in departments" :key="dept.id" :value="dept.id">
          {{ dept.name }}
        </option>
      </select>
      <select v-model="filters.isDismissed" @change="applyFilters" class="filter-select">
        <option value="">Все сотрудники</option>
        <option value="false">Активные</option>
        <option value="true">Уволенные</option>
      </select>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <table v-if="!loading && list.length > 0" class="data-table">
      <thead>
        <tr>
          <th>Фамилия</th>
          <th>Имя</th>
          <th>Отчество</th>
          <th>Дата рождения</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id" :class="{ dismissed: item.isDismissed }">
          <td>{{ item.lastName }}</td>
          <td>{{ item.firstName }}</td>
          <td>{{ item.middleName || '—' }}</td>
          <td>{{ formatDate(item.birthDate) }}</td>
          <td>
            <span :class="item.isDismissed ? 'badge-dismissed' : 'badge-active'">
              {{ item.isDismissed ? 'Уволен' : 'Активен' }}
            </span>
          </td>
          <td>
            <button @click="openEditDialog(item)" class="btn-edit" :disabled="item.isDismissed">✏️</button>
            <button v-if="!item.isDismissed" @click="confirmDismiss(item)" class="btn-dismiss">📤</button>
            <button @click="confirmDelete(item)" class="btn-delete">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else-if="!loading && list.length === 0" class="empty">
      Нет сотрудников. Добавьте первого!
    </div>

    <!-- Модальное окно (упрощённо, полная форма будет очень большой) -->
    <div v-if="dialogVisible" class="modal" @click.self="dialogVisible = false">
      <div class="modal-content modal-large">
        <h2>{{ isEdit ? 'Редактировать сотрудника' : 'Новый сотрудник' }}</h2>
        <form @submit.prevent="save">
          <div class="form-row">
            <div class="form-group">
              <label>Фамилия *</label>
              <input v-model="formData.lastName" required />
            </div>
            <div class="form-group">
              <label>Имя *</label>
              <input v-model="formData.firstName" required />
            </div>
            <div class="form-group">
              <label>Отчество</label>
              <input v-model="formData.middleName" />
            </div>
          </div>
          <div class="form-group">
            <label>Дата рождения *</label>
            <input v-model="formData.birthDate" type="date" required />
          </div>
          <div class="form-group">
            <label>Серия паспорта *</label>
            <input v-model="formData.passportSeries" required />
          </div>
          <div class="form-group">
            <label>Номер паспорта *</label>
            <input v-model="formData.passportNumber" required />
          </div>
          <div class="form-group">
            <label>Дата выдачи паспорта *</label>
            <input v-model="formData.passportIssueDate" type="date" required />
          </div>
          <div class="form-group">
            <label>Код подразделения</label>
            <input v-model="formData.passportCode" />
          </div>
          <div class="form-group">
            <label>Кем выдан *</label>
            <input v-model="formData.passportIssuedBy" required />
          </div>
          <div class="modal-actions">
            <button type="button" @click="dialogVisible = false" class="btn-secondary">Отмена</button>
            <button type="submit" class="btn-primary">Сохранить</button>
          </div>

           <!-- Блок файлов (только для редактирования) -->
          <div v-if="isEdit && selectedEmployee" class="files-section">
            <h3>Сканы паспорта</h3>
            
            <!-- Список файлов -->
            <div v-for="file in files" :key="file.id" class="file-item">
              <a :href="`http://localhost:3000/files/download/${file.id}`" target="_blank">
                {{ file.name }}
              </a>
              <button type="button" @click="deleteFile(file.id)" class="btn-delete-small">🗑️</button>
            </div>
            
            <!-- Форма загрузки -->
            <div class="upload-form">
              <input type="file" ref="fileInput" @change="onFileSelected" accept="image/*,application/pdf" />
              <button type="button" @click="uploadFile" :disabled="!selectedFile">Загрузить скан</button>
            </div>
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
import { storeToRefs } from 'pinia'; 
import { useEmployeesStore } from '../stores/employees';
import { useDepartmentsStore } from '../stores/departments';
import api from '../api/index';

const store = useEmployeesStore();
const departmentsStore = useDepartmentsStore();

const { list, loading, error } = storeToRefs(store);

const departments = ref([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const selectedId = ref(null);
let searchTimeout = null;

const filters = ref({
  search: '',
  departmentId: null,
  isDismissed: '',
});

const formData = ref({
  lastName: '',
  firstName: '',
  middleName: '',
  birthDate: '',
  passportSeries: '',
  passportNumber: '',
  passportIssueDate: '',
  passportCode: '',
  passportIssuedBy: '',
  registrationRegion: '',
  registrationLocality: '',
  registrationStreet: '',
  registrationHouse: '',
  registrationBuilding: '',
  registrationApartment: '',
});

onMounted(async () => {
  await departmentsStore.fetchAll();
  departments.value = departmentsStore.list;
  applyFilters();
});

function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
}

function handleSearch() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 300);
}

function applyFilters() {
  store.fetchAll({
    search: filters.value.search,
    departmentId: filters.value.departmentId,
    isDismissed: filters.value.isDismissed,
  });
}

function openCreateDialog() {
  isEdit.value = false;
  formData.value = {
    lastName: '', firstName: '', middleName: '', birthDate: '',
    passportSeries: '', passportNumber: '', passportIssueDate: '',
    passportCode: '', passportIssuedBy: '',
    registrationRegion: '', registrationLocality: '', registrationStreet: '',
    registrationHouse: '', registrationBuilding: '', registrationApartment: '',
  };
  selectedId.value = null;
  selectedEmployee.value = null;
  files.value = [];
  dialogVisible.value = true;
}

function openEditDialog(item) {
  isEdit.value = true;
  formData.value = {
    lastName: item.lastName,
    firstName: item.firstName,
    middleName: item.middleName || '',
    birthDate: item.birthDate,
    passportSeries: item.passportSeries,
    passportNumber: item.passportNumber,
    passportIssueDate: item.passportIssueDate,
    passportCode: item.passportCode || '',
    passportIssuedBy: item.passportIssuedBy,
    registrationRegion: item.registrationRegion || '',
    registrationLocality: item.registrationLocality || '',
    registrationStreet: item.registrationStreet || '',
    registrationHouse: item.registrationHouse || '',
    registrationBuilding: item.registrationBuilding || '',
    registrationApartment: item.registrationApartment || '',
  };
  selectedId.value = item.id;
  selectedEmployee.value = item; 
  fetchFiles(item.id);    
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
    applyFilters();
  } catch (err) {
    alert('Ошибка: ' + (err.response?.data?.message || err.message));
  }
}

async function confirmDismiss(item) {
  if (confirm(`Уволить сотрудника "${item.lastName} ${item.firstName}"?`)) {
    try {
      await store.dismiss(item.id);
      applyFilters();
      alert('Сотрудник уволен');
    } catch (err) {
      alert('Ошибка: ' + (err.response?.data?.message || err.message));
    }
  }
}

function confirmDelete(item) {
  if (confirm(`Удалить сотрудника "${item.lastName} ${item.firstName}"?`)) {
    store.delete(item.id);
  }
}

const selectedEmployee = ref(null);
const files = ref([]);
const selectedFile = ref(null);
const fileInput = ref(null);

function onFileSelected(event) {
  selectedFile.value = event.target.files[0];
}

async function uploadFile() {
  if (!selectedFile.value || !selectedEmployee.value) return;
  
  const formData = new FormData();
  formData.append('file', selectedFile.value);
  
  try {
    await api.post(`/files/upload/${selectedEmployee.value.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    alert('Файл загружен');
    fetchFiles(selectedEmployee.value.id);
    selectedFile.value = null;
    if (fileInput.value) fileInput.value.value = '';
  } catch (err) {
    alert('Ошибка загрузки: ' + err.message);
  }
}

async function fetchFiles(employeeId) {
  try {
    const response = await api.get(`/files/employee/${employeeId}`);
    files.value = response.data;
  } catch (err) {
    console.error('Ошибка загрузки списка файлов', err);
  }
}

async function deleteFile(fileId) {
  if (confirm('Удалить файл?')) {
    await api.delete(`/files/${fileId}`);
    fetchFiles(selectedEmployee.value.id);
  }
}
</script>

<style scoped>
.employees-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.filter-input, .filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.filter-input {
  flex: 1;
  min-width: 200px;
}
.btn-primary {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-edit, .btn-delete, .btn-dismiss {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  margin-right: 8px;
}
.btn-edit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
.dismissed {
  background-color: #fff3f3;
  color: #999;
}
.badge-active {
  background-color: #42b983;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}
.badge-dismissed {
  background-color: #dc3545;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
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
  z-index: 1000;
}
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-large {
  min-width: 600px;
}
.form-row {
  display: flex;
  gap: 15px;
}
.form-group {
  margin-bottom: 15px;
  flex: 1;
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
.files-section {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.file-item {
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.upload-form {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}
.btn-delete-small {
  background: none;
  border: none;
  cursor: pointer;
  color: red;
}
</style>