<template>
    <div class="flex flex-col gap-16">
        <XHeader title="Gestión de usuarios">
            <template #description>
                <p class="text-gray-800">Crea usuarios y asigna los roles correspondientes, procura garantizar que cada usuario cuente con los permisos adecuados para sus funciones.</p>
            </template>
        </XHeader>
        <div  class="flex flex-col gap-16">
            <div v-if="!hasUsers && !loading" class="flex flex-col items-center justify-center py-16 text-center">
                <div class="mb-6">
                    <div class="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                        <i class="pi pi-users text-4xl text-gray-400"></i>
                    </div>
                </div>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Aún no existen usuarios</h3>
                <p class="text-gray-500 mb-6">Comienza creando el primer usuario del sistema.</p>
                <XButton 
                    label="Nuevo usuario" 
                    icon="think-plus" 
                    @click="openCreateModal" 
                    class="!w-[150px]"/>
            </div>

            <div v-if="hasUsers" class="flex flex-col gap-8">
                <div class="flex flex-row justify-between">
                    <div class="self-center">
                        <XIconField>
                            <InputText 
                                v-model="filters['global'].value"
                                placeholder="Buscar..." 
                                class="!w-[250px]"
                            />
                            <XInputIcon icon="search" @click="handleSearch" />
                        </XIconField>
                    </div>
                    <div class="self-center">
                        <XButton 
                            label="Nuevo usuario" 
                            icon="think-plus" 
                            @click="openCreateModal" 
                            class="!w-[150px]"/>
                    </div>
                </div>
                <!-- DataTable -->
                <div class="flex flex-col gap-12">
            <DataTable 
                v-if="hasUsers"
                :value="paginatedUsers" 
                v-model:filters="filters"
                :rowsPerPageOptions="[10, 25, 50, 100]"
                :loading="loading"
                dataKey="id"
                filterDisplay="row"
                :globalFilterFields="['email', 'fullname', 'roleDescription', 'code', 'statusDescription']"
            >
                <template #empty> <span class="flex justify-center">No se encontraron usuarios.</span> </template>
                <template #loading> <span class="flex justify-center">Cargando datos de usuarios. Por favor espere.</span> </template>
                
                <Column field="codigo" header="Código" sortable class="w-[158px]" :showFilterMenu="false">
                    <template #body="{ data }">
                        {{ data.code }}
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <IconField>
                            <InputText 
                                v-model="filterModel.value" 
                                type="text" 
                                @input="filterCallback()" 
                                class="!w-56" 
                                placeholder="Buscar"
                            />
                            <XInputIcon icon="search" />
                        </IconField>
                        
                    </template>
                </Column>

                <Column field="fullname" header="Nombre" sortable class="w-[280px]" :showFilterMenu="false">
                    <template #body="{ data }">
                        {{ data.fullname }}
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <IconField>
                            <InputText 
                                v-model="filterModel.value" 
                                type="text" 
                                @input="filterCallback()" 
                                class="!w-[234px]" 
                                placeholder="Buscar"
                            />
                            <XInputIcon icon="search" />
                        </IconField>
                    </template>
                </Column>

                <Column field="email" header="Correo Electrónico" sortable class="w-[225px]" :showFilterMenu="false">
                    <template #body="{ data }">
                        {{ data.email }}
                    </template>
                    <template #filter="{ filterModel , filterCallback}">
                        <IconField>
                            <InputText 
                                v-model="filterModel.value" 
                                type="text" 
                                @input="filterCallback()" 
                                class="!w-88" 
                                placeholder="Buscar"
                            />
                            <XInputIcon icon="search" />
                        </IconField>
                    </template>
                </Column>

                <Column field="rol" header="Rol" sortable class="w-[158px]" :showFilterMenu="false">
                    <template #body="{ data }">
                        <Tag 
                            :value="data.roleDescription" 
                            severity="neutral"
                        />
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <XSelect 
                                name="filterRole"
                                v-model="filterModel.value" 
                                @change="filterCallback()" 
                                :options="roles" 
                                optionLabel="label" 
                                optionValue="value"
                                placeholder="Seleccionar" 
                                class="!w-56" 
                                :showClear="true"
                            />
                    </template>
                </Column>

                <Column field="isActive" header="Estado" sortable class="w-[158px]" :showFilterMenu="false">
                    <template #body="{ data }">
                        <Tag 
                            :value="data.statusDescription" 
                            :severity="data.isActive ? 'success' : 'danger'"
                        />
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                            <XSelect 
                                name="filterIsActive"
                                v-model="filterModel.value" 
                                @change="filterCallback()" 
                                :options="statusOptions" 
                                optionLabel="label" 
                                optionValue="value"
                                placeholder="Seleccionar" 
                                class="!w-56" 
                                :showClear="true"
                            />
                        </template>
                </Column>
                <Column header="Acciones"  class="w-[133px]">
                    <template #body="{ data }">
                        <div class="flex gap-2">
                            <XButton 
                                variant="outlined" 
                                icon="lock"  
                                size="small" 
                                @click="openRevertPassModal(data)" 
                                v-tooltip="{ value: 'Reseteo de contraseña', hideDelay: 300 }"
                            />
                            <XButton 
                                label="Editar" 
                                size="small" 
                                @click="openEditModal(data)"
                            />
                        </div>
                    </template>
                </Column>
                    </DataTable>

                    <Paginator 
                        v-if="hasUsers"
                        :rows="rows"
                        :totalRecords="users.length"
                        :first="first"
                        :rowsPerPageOptions="[10, 25, 50, 100]"
                        @page="onPage"
                    />
                </div>
            </div>
        </div>

        <UserModal 
            v-model="modalStateUser.modalUser" 
            :mode="modalStateUser.mode"
            :userData="modalStateUser.userData"
            @save="handleUserSaved"
        />

        <UserModalReset
            v-model="modalStateRevert.showModal"
            :userData="modalStateRevert.userData"
            @save="handlePasswordReset"
        />
    </div>
</template>

<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core';
import type { ModalMode, ServiceError, UserListItem, UserModalData } from '~/features/users/types';
import UserModal from '~/features/users/UserModal.vue';
import UserModalReset from '~/features/users/UserModalReset.vue';
import { userService } from '~/services/userService';

// Composables 
const toast = useToast()

//State
const users = ref<UserListItem[]>([]);
const loading = ref(false)
const searchTerm = ref('')
const first = ref(0)
const rows = ref(10)

// Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    fullname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    rol: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    codigo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    isActive: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const roles = ref([
    { label: 'Administrador', value: 'Administrador' },
]);

const statusOptions = ref([
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
]);

//Paginator
const paginatedUsers = computed(() => {
    return users.value.slice(first.value, first.value + rows.value)
})

const onPage = (event: any) => {
    first.value = event.first
    rows.value = event.rows
}

// State para el modal principal
const modalStateUser = ref<{
    modalUser: boolean,
    mode: ModalMode,
    userData?: UserModalData,
}>({
    modalUser: false,
    mode: 'create',
    userData: undefined
})

// State para el modal de reseteo de contraseña
const modalStateRevert = ref<{
    showModal: boolean,
    userData?: UserModalData,
}>({
    showModal: false,
    userData: undefined
})

const modalRevertPassUser = ref(false)

// Computed para verificar si hay usuarios
const hasUsers = computed(() => {
    return users.value && users.value.length > 0
})

// Methods
const loadUsers = async (): Promise<void> => {
    loading.value = true
    try {
        const response = await userService.getUsers()
        users.value = response.users
    } catch (error) {
        console.error('Error loading users:', error)
        const serviceError = error as ServiceError

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: serviceError.message || 'Error al cargar los usuarios',
            life: 5000
        })
    } finally {
        loading.value = false
    }
}

const handleSearch = async (): Promise<void> => {
    // Si hay término de búsqueda, hacer búsqueda en servidor
    if (searchTerm.value.trim()) {
        loading.value = true
        
        try {
            const response = await userService.getUsers({ 
                search: searchTerm.value.trim() 
            })
            users.value = response.users
        } catch (error) {
            console.error('Error searching users:', error)
            const serviceError = error as ServiceError

            toast.add({
                severity: 'error',
                summary: 'Error de búsqueda',
                detail: serviceError.message || 'Error al buscar usuarios',
                life: 5000
            })
        } finally {
            loading.value = false
        }
    } else {
        await loadUsers()
    }
}

const openCreateModal = (): void => {
    modalStateUser.value = {
        modalUser: true,
        mode: 'create',
        userData: undefined
    }
}

const openEditModal = (userData: UserModalData): void => {
    modalStateUser.value = {
        modalUser: true,
        mode: 'edit',
        userData:{
            code: userData.code,
            fullname: userData.fullname,
            email: userData.email,
            alias: userData.alias,
            roleCode: userData.roleCode,
            isActive: userData  .isActive
        }
    }
}

const handleUserSaved = (): void => {
    loadUsers()
}

const openRevertPassModal = (userData: UserModalData): void => {
    console.log('Abriendo modal de prueba')
    modalStateRevert.value = {
        showModal: true,
        userData: {
            code: userData.code,
            fullname: userData.fullname,
            email: userData.email,
            alias: userData.alias,
            roleCode: userData.roleCode,
            isActive: userData.isActive
        }
    }
}

const handlePasswordReset = (userData?: UserModalData): void => {
    console.log('Contraseña reseteada para:oo', userData)
}

// Lifecycle
onMounted(() => {
    loadUsers()
})
</script>