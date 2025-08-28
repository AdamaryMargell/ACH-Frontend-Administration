<template>
    <div class="flex flex-col gap-20">
        <XHeader title="Parámetros" :breadcrumb-items="itemsBreadParameters" :show-breadcrumb="true">
            <template #description>
                <p class="text-gray-800">Consulta r todos los parámetros configurados en el sistema y realizar las modificaciones necesarias. Además te presenta el historial de cambios para asegurar un control adecuado.</p>
            </template>
        </XHeader>

        <div class="flex flex-col gap-12">
            <div v-if="!hasParameters && !loading" class="flex flex-col items-center justify-center py-16 text-center">
                <div class="mb-6">
                    <div class="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                        <i class="pi pi-users text-4xl text-gray-400"></i>
                    </div>
                </div>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Aún no existen parámetros</h3>
                <p class="text-gray-500 mb-6">No hay parámetros configurados en el sistema.</p>
            </div>

            <template v-if="hasParameters">
                <p class="text-gray-800">Selecciona los canales que deseas ver en la tabla.</p>

                <div class="flex flex-row justify-between">
                    <div class="self-center">
                        <XIconField>
                            <InputText 
                                v-model="searchTermParameter"
                                placeholder="Buscar" 
                                class="!w-[250px]"
                            />
                            <XInputIcon icon="search"/>
                        </XIconField>
                    </div>
                    <div class="self-center">
                        <SelectButton 
                            v-model="selectedChannel" 
                            :options="channelOptions" 
                            optionLabel="value" 
                            dataKey="value" 
                            aria-labelledby="custom"
                            :pt="{
                                root: { class: 'bg-white gap-6' },
                            }"
                        >
                            <template #option="slotProps">
                                <div class="flex items-center justify-center max-w-70 w-50">
                                    <span class="font-medium">{{ slotProps.option.value }}</span>
                                </div>
                            </template>
                        </SelectButton>
                    </div>
                </div>

                <div class="flex flex-col">
                    <div class="flex flex-col gap-12">
                        <DataTable
                            :value="paginatedParameters" 
                            :loading="loading"
                            dataKey="id"
                            :globalFilterFields="['code', 'value', 'description', 'dataType', 'systemAcronym']"
                        >
                            <template #empty> 
                                <span class="flex justify-center">
                                    {{ filteredParameters.length === 0 && searchTermParameter.trim() ? 
                                        'No se encontraron parámetros que coincidan con la búsqueda.' : 
                                        'No se encontraron parámetros para el canal seleccionado.' }}
                                </span> 
                            </template>
                            <template #loading> 
                                <span class="flex justify-center">Cargando datos de parámetros. Por favor espere.</span> 
                            </template>

                            <Column field="systemAcronym" header="Canal" sortable style="min-width: 100px;">
                                <template #body="{ data }">
                                    {{ data.systemAcronym }}
                                </template>
                            </Column>

                            <Column field="code" header="Código" sortable headerStyle="width: 100px;" bodyStyle="width: 100px;">
                                <template #body="{ data }">
                                    {{ data.code }}
                                </template>
                            </Column>
                        
                            <Column field="value" header="Valor" sortable style="min-width: 160px;">
                                <template #body="{ data }">
                                    {{ data.value }}
                                </template>
                            </Column>

                            <Column field="dataType" header="Tipo de Dato" sortable style="min-width: 100px;">
                                <template #body="{ data }">
                                    {{ data.dataType }}
                                </template>
                            </Column> 

                            <Column field="description" header="Descripción" sortable class="min-w-[275px]">
                                <template #body="{ data }">
                                    {{ data.description }}
                                </template>
                            </Column>

                            <Column header="Acciones" class="min-w-[210px]">
                                <template #body="{ data }">
                                    <div class="flex gap-4">
                                        <XButton 
                                            variant="outlined" 
                                            icon="edit-pencil"
                                            class="p-2"
                                            v-tooltip="{ value: 'Editar parámetro', hideDelay: 300 }"
                                            @click="openEditModal(data)"
                                        />
                                        <XButton 
                                            label="Ver historial"
                                        />
                                    </div>
                                </template>
                            </Column>
                        </DataTable>

                        <Paginator 
                            v-if="filteredParameters.length > 0"
                            v-model:first="first"
                            v-model:rows="rows"
                            :totalRecords="filteredParameters.length"
                            :rowsPerPageOptions="[2, 10, 25, 50, 100]"
                        />
                    </div>
                </div>
            </template>
        </div>

        <ParameterModal 
            v-model="modalStateParameter.modalParameter" 
            :parameterData="modalStateParameter.parameterData"
            @save="handleParameterSaved"
        />
    </div>
</template>

<script setup lang="ts">
import ParameterModal from '~/features/parameters/ParameterModal.vue';
import type { ParameterListItem, ParameterModalData } from '~/features/parameters/types';
import type { ServiceError } from '~/features/users/types';
import { parametersService } from '~/services/parametersService';

// Composables 
const toast = useToast()

// State
const parameters = ref<ParameterListItem[]>([]);
const loading = ref(false);
const searchTermParameter = ref('')
const first = ref(0)
const rows = ref(10)

const itemsBreadParameters = ref([
    { label: 'Inicio'},
    { label: 'Configuracion'},
    { label: 'Parámetros'}
])

// SelectButton de canales
const selectedChannel = ref({ value: 'Todos' });

// Computed para generar las opciones dinámicamente
const channelOptions = computed(() => {
    const uniqueChannels = [...new Set(parameters.value.map(param => param.systemAcronym))];
    const channelOpts = uniqueChannels.map(channel => ({ value: channel }));
    
    return [
        { value: 'Todos' },
        ...channelOpts.sort((a, b) => a.value.localeCompare(b.value))
    ];
});

// Computed para filtrar parámetros por canal seleccionado y término de búsqueda
const filteredParameters = computed(() => {
    if (!parameters.value.length) return [];
    
    let filtered = parameters.value;
    
    // Filtrar por canal
    if (selectedChannel.value?.value !== 'Todos') {
        filtered = filtered.filter(param => param.systemAcronym === selectedChannel.value.value);
    }
    
    // Filtrar por término de búsqueda
    if (searchTermParameter.value.trim()) {
        const search = searchTermParameter.value.toLowerCase().trim();
        filtered = filtered.filter(param => 
            param.code.toLowerCase().includes(search) ||
            param.value.toLowerCase().includes(search) ||
            param.description.toLowerCase().includes(search) ||
            param.dataType.toLowerCase().includes(search) ||
            param.systemAcronym.toLowerCase().includes(search)
        );
    }
    
    return filtered;
});

// Computed para obtener los parámetros paginados
const paginatedParameters = computed(() => {
    const start = first.value;
    const end = start + rows.value;
    return filteredParameters.value.slice(start, end);
});

// Computed para verificar si hay parámetros
const hasParameters = computed(() => {
    return parameters.value && parameters.value.length > 0
})

// Resetear paginación cuando cambien los filtros
watch([selectedChannel, searchTermParameter], () => {
    first.value = 0;
});

// Modal state
const modalStateParameter = ref<{
    modalParameter: boolean,
    parameterData?: ParameterModalData,
}>({
    modalParameter: false,
    parameterData: undefined
})

// Methods
const loadParameters = async (): Promise<void> => {
    loading.value = true
    try {
        const response = await parametersService.getParameters()
        parameters.value = response.parameters
    } catch (error) {
        console.error('Error loading parameters:', error)
        const serviceError = error as ServiceError

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: serviceError.message || 'Error al cargar los parámetros',
            life: 5000
        })
    } finally {
        loading.value = false
    }
}

const openEditModal = (parameterData: ParameterListItem) => {
    modalStateParameter.value = {
        modalParameter: true,
        parameterData: {
            code: parameterData.code,
            value: parameterData.value,
            description: parameterData.description,
            dataType: parameterData.dataType,
        }
    }
}

const handleParameterSaved = (): void => {
    loadParameters()
}

// Lifecycle
onMounted(() => {
    loadParameters()
})
</script>