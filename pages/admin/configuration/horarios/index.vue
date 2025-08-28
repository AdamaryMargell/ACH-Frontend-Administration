<template>
    <XHeader title="Gestión de horarios">
        <template #description>
                <span>Gestiona horarios regulares y extraordinarios, asegúrate de configurarlos adecuadamente para garantizar la correcta continuidad operativa.</span>
        </template>
    </XHeader>
    <div class="flex flex-col gap-16">
        <div class="w-full mt-16 flex justify-end">
            <XButton variant="outlined" icon="plus" label="Nuevo horario extraordinario" />
        </div>
        <div class="flex flex-row">
            <XInputText name="codigo" placeholder="Buscar" v-model="buscar"/>
            <SelectButton class="w-[1000px] flex justify-between" v-model="value" :options="options" optionLabel="value" dataKey="value" aria-labelledby="custom">
                <template #option="slotProps">
                    <div class="flex w-auto">
                        <p>{{ slotProps.option.value }}</p>
                    </div>
                </template>
            </SelectButton>
        </div>
        <DataTable class="col-span-12" v-model:filters="filters" filterDisplay="row" :value="histoparticipantes" :rows="10" :globalFilterFields="['codigo','nombres', 'siglas', 'alias', 'ultimaModificacion', 'usuario']">
            <Column class="col-span-1" :showFilterMenu="false" filterField="canal" field="canal" header="Canal">
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="codigo" />
                </template>
            </Column>
            <Column class="col-span-4" :showFilterMenu="false" field="transaction" header="Transaction">
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="transaction" />
                </template>                    
            </Column>
            <Column class="col-span-1" :showFilterMenu="false" field="dia" header="Dia">
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="dia" />
                </template>                    
            </Column>
            <Column class="col-span-2" :showFilterMenu="false" field="horainicio" header="Hora Inicio">
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Hora inicio" />
                </template>                    
            </Column>
            <Column class="col-span-1" :showFilterMenu="false" field="horafin" header="Hora fin">
                 <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Hora fin" />
                </template>                   
            </Column>
            <Column class="col-span-1" :showFilterMenu="false" field="detalle" header="Detalle">
                 <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Detalle" />
                </template>                   
            </Column>
            <Column class="col-span-1" :showFilterMenu="false" field="tipoHorario" header="Tipo de horario">
                 <template #body="{ data }">
                    {{ data.name }}
                 </template>
                 <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="tipoHorario" />
                </template>                   
            </Column>
            <Column class="col-span-1" :showFilterMenu="false" header="Acciones">
                 <template #body>
                    <div class="flex flex-row">
                        <XButton variant="outlined" icon="file-see" />
                        <XButton label="Editar"/>
                    </div>
                 </template>               
            </Column>
        </DataTable>
    </div>
</template>
<script lang="ts" setup>
import { FilterMatchMode } from '@primevue/core/api';
    const buscar =ref()

const value = ref(null);
const options = ref([
    { icon: 'pi pi-align-left', value: 'Left' },
    { icon: 'pi pi-align-right', value: 'Right' },
    { icon: 'pi pi-align-center', value: 'Center' },
    { icon: 'pi pi-align-justify', value: 'Justify' }
]);

const filters = ref({
    canal: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    transaction: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    dia: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    horainicio: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    horafin: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    detalle: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    tipoHorario: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

const histoparticipantes = ref([
    {
        canal: 'ACCL',
        transaction: 'Recepción orden...',
        dia:'LU,MA,MI,JU,VI...',
        horainicio:'08:00',
        horafin:'18:00',
        detalle: 'Canal int.',
        tipoHorario: { name: 'Extraordinario', value: true},
    },
    {
        canal: 'MLD',
        transaction: 'Recepción orden...',
        dia:'LU,MA,MI,JU,VI...',
        horainicio:'08:00',
        horafin:'18:00',
        detalle: 'Canal int.',
        tipoHorario: { name: 'Extraordinario', value: true},
    },
    {
        canal: 'MLD',
        transaction: 'Recepción orden...',
        dia:'LU,MI,VI,',
        horainicio:'08:00',
        horafin:'18:00',
        detalle: 'Canal int.',
        tipoHorario: { name: 'Extraordinario', value: false},
    },
    {
        canal: 'LIP',
        transaction: 'E14',
        dia:'LU,MI,VI,',
        horainicio:'08:00',
        horafin:'18:00',
        detalle: 'Canal int.',
        tipoHorario: { name: 'Extraordinario', value: false},
    },
    {
        canal: 'LIP',
        transaction: 'E14',
        dia:'LU,MA,MI,JU,VI...',
        horainicio:'08:00',
        horafin:'18:00',
        detalle: 'Canal int.',
        tipoHorario: { name: 'Extraordinario', value: true},
    },
]);
</script>
<style scope>
    .p-togglebutton .p-component {
        @apply bg-green-500
    }
</style>