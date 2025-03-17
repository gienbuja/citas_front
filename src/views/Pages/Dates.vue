<template>
    <div class="h-full">
        <DataTable class="" v-model:filters="filters" :value size="small" tableStyle="min-width: 50rem"
            :loading="loadValues" scrollable scrollHeight="flex" paginator :rows="20"
            :rowsPerPageOptions="[5, 10, 20, 50]">
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0 text-3xl">Citas</h4>
                    <IconField>
                        <InputIcon>
                            <i class="fi fi-br-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                    </IconField>
                    <Button @click="visibleNew = true" icon="fi fi-rr-calendar-plus" size="small" label="Nueva cita" />
                </div>
            </template>
            <template #loading>
                <i class="fi fi-br-spinner flex text-6xl animate-spin"></i>
                <div class="">
                    <p class="font-bold px-2 text-2xl">Cargando...</p>
                </div>
            </template>
            <template #empty>
                <div v-if="loadValues == false" class="text-center">
                    <i class="fi fi-br-calendar-exclamation text-7xl"></i>
                    <h3 class="mt-2 text-xl font-semibold text-gray-900">No hay citas</h3>
                    <p class="mt-1 text-gray-500">Agregue una nueva cita con el boton nueva cita.</p>
                </div>
            </template>
            <Column v-for="col in columns" :field="col.field" :header="col.header" :class="col.class">
                <template #body="{ data }">
                    <time v-if="col.type == 'date'">{{ new Date(data[col.field]).toLocaleDateString() }}</time>
                    <Tag v-else-if="col.type == 'tag'" :severity="getSeverity(data[col.field])">
                        {{ data[col.field] }}
                    </Tag>
                    <p v-else-if="col.type == 'time'">
                        {{ data[col.field].length > 5 ? dateToTime(new Date(data[col.field])) : data[col.field] }}
                    </p>
                    <p class="truncate" v-else-if="col.type == 'custom'">
                        {{ col.customField(data[col.field]) }}
                    </p>
                    <p v-else>{{ data[col.field] }}</p>
                </template>
            </Column>
            <Column v-if="actions" class="w-32">
                <template #body="{ data }">
                    <div class="flex gap-1 justify-center">
                        <template v-for="action in actions">
                            <Button v-tooltip.top="action.tooltip" @click="action.event(data)"
                                v-if="action.visible(data) == null ? true : action.visible(data)" size="small"
                                class="!size-8" outlined :icon="action.icon" :severity="action.severity" />
                        </template>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
    <Dialog v-model:visible="visibleNew" modal header="Nueva cita" :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Complete los siguientes datos</span>
        <div class="flex items-center gap-4 mb-4">
            <label for="fecha" class="font-semibold w-24">Fecha</label>
            <DatePicker v-model="form.fecha" :minDate="new Date(new Date().setDate(new Date().getDate() + 1))"
                :manualInput="false" id="fecha" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex items-center gap-4 mb-4">
            <label for="hora" class="font-semibold w-24">Hora</label>
            <DatePicker v-model="form.hora" timeOnly fluid id="hora" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex items-center gap-4 mb-8">
            <label for="descripcion" class="font-semibold w-24">Descripcion</label>
            <Textarea v-model="form.descripcion" id="descripcion" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancelar" severity="secondary" @click="visibleNew = false"></Button>
            <Button type="button" label="Guardar" @click="newDate()"></Button>
        </div>
    </Dialog>

    <Dialog v-model:visible="visibleView" modal header="Detalle de la cita" :style="{ width: '25rem' }">
        <div class="flex items-center gap-4 mb-4">
            <label for="fecha" class="font-semibold w-24">Fecha</label>
            <Tag severity="info" :value="new Date(viewData.fecha).toLocaleDateString()" id="fecha" class="flex-auto" />
        </div>
        <div class="flex items-center gap-4 mb-4">
            <label for="hora" class="font-semibold w-24">Hora</label>
            <Tag severity="info" :value="viewData.hora.length > 5 ? dateToTime(new Date(viewData.hora)) : viewData.hora"
                id="hora" class="flex-auto" />
        </div>
        <div class="flex items-center gap-4 mb-4">
            <label for="descripcion" class="font-semibold w-24">Descripcion</label>
            <Tag severity="info" :value="viewData.descripcion" id="descripcion" class="flex-auto" />
        </div>
        <div class="flex items-center gap-4 mb-4">
            <label for="estado" class="font-semibold w-24">Creada</label>
            <Tag severity="info" :value="new Date(viewData.created_at).toLocaleDateString()" id="estado"
                class="flex-auto" />
        </div>
        <div class="flex items-center gap-4 mb-4">
            <label for="estado" class="font-semibold w-24">Actualizada</label>
            <Tag :value="viewData.created_at == viewData.updated_at ? 'Sin actualizaciones' : new Date(viewData.updated_at).toLocaleDateString()"
                id="estado" class="flex-auto" />
        </div>
        <div class="flex items-center gap-4 mb-4">
            <label for="estado" class="font-semibold w-24">Estado</label>
            <Tag :value="viewData.estado" id="estado" :severity="getSeverity(viewData.estado)" class="flex-auto" />
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cerrar" severity="secondary" @click="visible = false" />
        </div>
    </Dialog>

    <Dialog v-model:visible="visibleEdit" modal header="Editar cita" :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Editando la cita #{{ formEdit.id }}</span>
        <div class="flex items-center gap-4 mb-4">
            <label for="fecha" class="font-semibold w-24">Fecha</label>
            <DatePicker v-model="formEdit.fecha" :minDate="new Date(new Date().setDate(new Date().getDate() + 1))"
                :manualInput="false" id="fecha" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex items-center gap-4 mb-4">
            <label for="hora" class="font-semibold w-24">Hora</label>
            <DatePicker v-model="formEdit.hora" timeOnly fluid id="hora" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex items-center gap-4 mb-8">
            <label for="descripcion" class="font-semibold w-24">Descripcion</label>
            <Textarea v-model="formEdit.descripcion" id="descripcion" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancelar" severity="secondary" @click="visibleNew = false"></Button>
            <Button type="button" label="Guardar" @click="editDate()"></Button>
        </div>
    </Dialog>
</template>

<script setup>
import axios from 'axios';
import { Button, Column } from 'primevue';
import { onMounted, ref } from 'vue';
import { useAuth } from '@/stores/auth';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

const auth = useAuth();
const loadValues = ref(true)
const visibleNew = ref(false)
const visibleView = ref(false)
const visibleEdit = ref(false)
const apiUrl = import.meta.env.VITE_API_URL;

const filters = ref(
    {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        descripcion: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        fecha: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        hora: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        estado: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    }
);
const form = ref({
    fecha: new Date(new Date().setDate(new Date().getDate() + 1)),
    hora: null,
    descripcion: ''
})
const formEdit = ref({})
const viewData = ref()
const value = ref([])

const columns = [
    {
        field: 'user',
        header: 'Usuario',
        class: 'w-32',
        type: 'custom',
        visible: auth.user.rol == 'Admin',
        customField: (data) => {
            return data?.name
        }
    },
    {
        field: 'fecha',
        header: 'Fecha',
        type: 'date',
        class: 'w-32'
    },
    {
        field: 'hora',
        header: 'Hora',
        type: 'time',
        class: 'w-20'
    },
    {
        field: 'descripcion',
        header: 'Descripcion',
        type: 'text',
    },
    {
        field: 'estado',
        header: 'Estado',
        type: 'tag',
        class: 'w-28',
    }
]
const actions = ref([
    {
        severity: 'info',
        icon: 'fi fi-sr-eye',
        tooltip: 'Ver',
        visible: (data) => true,
        event: (data) => {
            viewData.value = data;
            visibleView.value = true
        }
    },
    {
        severity: 'warn',
        icon: 'fi fi-sr-calendar-lines-pen',
        visible: (data) => data.estado == 'Pendiente',
        tooltip: 'Editar',
        event: (data) => {
            formEdit.value = JSON.parse(JSON.stringify(data));
            formEdit.value.fecha = new Date(formEdit.value.fecha)
            visibleEdit.value = true
        }
    },
    {
        severity: 'success',
        icon: 'fi fi-sr-check',
        visible: (data) => auth.user.rol === 'Admin' & data.estado != 'Confirmada',
        tooltip: 'Confirmar',
        event: (data) => {
            formEdit.value = JSON.parse(JSON.stringify(data));
            changeStatusDate('Confirmada')
        }
    },
    {
        severity: 'danger',
        icon: 'fi fi-bs-circle-xmark',
        visible: (data) => data.estado == 'Pendiente',
        tooltip: 'Cancelar',
        event: (data) => {
            formEdit.value = JSON.parse(JSON.stringify(data));
            changeStatusDate('Cancelar')
        }
    },
    {
        severity: 'danger',
        icon: 'fi fi-sr-trash',
        tooltip: 'Eliminar',
        visible: (data) => auth.user.rol === 'Admin',
        event: (data) => {
            deleteDate(data)
        }
    },
])

async function fetchCitas() {
    loadValues.value = true
    try {
        const response = await axios.get(`${apiUrl}/citas`);
        value.value = response.data;
    } catch (error) {
        console.error('Error fetching citas:', error);
    }
    loadValues.value = false
};

function getSeverity(data) {
    if (data == 'Pendiente') {
        return 'warn'
    } else if (data == 'Cancelada') {
        return 'danger'
    }
    return 'success'
}

async function newDate() {
    try {
        const response = await axios.post(`${apiUrl}/citas`, form.value);
        value.value.push(response.data);
        visibleNew.value = false;
    } catch (error) {
        console.error('Error creating new date:', error);
    }
}

async function editDate() {
    try {
        const response = await axios.put(`${apiUrl}/citas/${formEdit.value.id}`, formEdit.value);
        const index = value.value.findIndex(cita => cita.id === formEdit.value.id);
        if (index !== -1) {
            value.value[index] = response.data;
        }
        visibleEdit.value = false;
    } catch (error) {
        console.error('Error editing date:', error);
    }
}

async function changeStatusDate(status) {
    try {
        formEdit.value.estado = status
        const response = await axios.put(`${apiUrl}/citas/${formEdit.value.id}`, formEdit.value);
        const index = value.value.findIndex(cita => cita.id === formEdit.value.id);
        if (index !== -1) {
            value.value[index] = response.data;
        }
        visibleEdit.value = false;
    } catch (error) {
        console.error('Error editing date:', error);
    }
}

async function deleteDate(data) {
    try {
        await axios.delete(`${apiUrl}/citas/${data.id}`);
        const index = value.value.findIndex(cita => cita.id === data.id);
        if (index !== -1) {
            value.value.splice(index, 1);
        }
    } catch (error) {
        console.error('Error deleting date:', error);
    }
}

function dateToTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

onMounted(() => {
    fetchCitas();
});
</script>