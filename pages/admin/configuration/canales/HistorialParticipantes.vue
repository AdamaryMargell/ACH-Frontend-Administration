<template>
    <div>
        <XHeader class="my-8" title="Historial Participantes - Administradora de cámara de Compensación"/>
        <span class="mb-20">Visualiza el historial de acciones asociados a los cambios de centros de procesamiento, consulta y filtra información en función a lo que requieras.</span>
        <div class="pt-12 flex flex-col gap-20">
            <div class="flex flex-col gap-12">
                <h5 class="text-lg text-gray-700">Filtrar por:</h5>
                <div class="grid grid-cols-4 gap-10">
                    <!-- <XInputText class="col-span-1" v-model="busqueda"  placeholder="Buscar" /> -->
                </div>
                <div class="grid grid-cols-12">
                <DataTable class="col-span-12" v-model:filters="filters" filterDisplay="row" :value="histoparticipantes" :rows="10" :globalFilterFields="['codigo','nombres', 'siglas', 'alias', 'ultimaModificacion', 'usuario']">
                    <Column class="col-span-1" :showFilterMenu="false" filterField="codigo" field="codigo" header="Codigo">
                        <template #filter="{ filterModel, filterCallback }">
                            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="codigo" />
                        </template>
                    </Column>
                    <Column class="col-span-6" :showFilterMenu="false" field="nombres" header="Nombre">
                        <template #filter="{ filterModel, filterCallback }">
                            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="codigo" />
                        </template>                    
                    </Column>
                    <Column class="col-span-1" :showFilterMenu="false" field="siglas" header="Siglas">
                        <template #filter="{ filterModel, filterCallback }">
                            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="nombre" />
                        </template>                    
                    </Column>
                    <Column class="col-span-2" :showFilterMenu="false" field="alias" header="Alias CPD">
                        <template #filter="{ filterModel, filterCallback }">
                            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="alias" />
                        </template>                    
                    </Column>
                    <Column class="col-span-1" :showFilterMenu="false" field="ultimaModificacion" header="Ultima modificación">
                         <template #filter="{ filterModel, filterCallback }">
                            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="ultimaModificacion" />
                        </template>                   
                    </Column>
                    <Column class="col-span-1" :showFilterMenu="false" field="usuario" header="Ususario">
                         <template #filter="{ filterModel, filterCallback }">
                            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="usuario" />
                        </template>                   
                    </Column>
                </DataTable>
                </div>
                <div class="flex justify-end  gap-4">
                    <XButton label="Descargar" icon="download"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api';

const filters = ref({
    codigo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    nombres: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    siglas: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    alias: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    ultimaModificacion: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    usuario: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

const busqueda = ref()

const histoparticipantes = ref([
    {
        codigo: 'f230fh0g3',
        nombres: 'Product Description 1',
        siglas:'ACCL',
        alias:'LPZ/SCZ',
        ultimaModificacion:'03/05/2024',
        usuario: 'user 1'
    },
    {
        codigo: 'f230fh0g3',
        nombres: 'Product Description 1',
        siglas:'INSTOCK',
        alias:'LPZ/SCZ',
        ultimaModificacion:'03/05/2024',
        usuario: 'user 2'
    },
    {
        canal: '2',
        codigo: 'f230fh0g3',
        nombres: 'Product Description 1',
        siglas:'INSTOCK',
        alias:'LPZ/SCZ',
        ultimaModificacion:'03/05/2024',
        usuario: 'user 3'
    },
    {
        canal: '1',
        codigo: 'rrqrqer',
        nombres: 'Bamboo Watch 12',
        siglas:'INSTOCK',
        alias:'LPZ/SCZ',
        ultimaModificacion:'03/05/2024',
        usuario: 'user 4'
    },
    {
        canal: '2',
        codigo: 'rrqrqer',
        nombres: 'Bamboo Watch 12',
        siglas:'INSTOCK',
        alias:'LPZ/SCZ',
        ultimaModificacion:'03/05/2024',
        usuario: 'user 5'
    },
]);

</script>

<style scoped>

</style>