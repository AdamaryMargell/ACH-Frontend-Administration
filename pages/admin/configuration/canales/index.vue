<template>
    <div>
        <XHeader title="Administracion de Canales" >
            <template #description>
                <p>Gestiona los canales modificando el centro de procesamiento, las rutas asociadas, los certificados correspondientes y realiza un seguimiento a través del historial de cambios.</p>
            </template>
        </XHeader>
        <div class="pt-12 flex flex-col gap-20">
            <div class="flex justify-between gap-4">
                <h5 class="text-lg text-gray-700">Texto</h5>
                <div class="self-center">
                    <XInputText name="codigo" placeholder="Buscar" v-model="codigo"/>
                </div>
            </div>

            <DataTable :value="canales" paginator :rows="10"  tableStyle="min-width: 50rem">
                <Column field="codigo" header="Codigo"></Column>
                <Column field="nombres" header="Nombre"></Column>
                <Column field="siglas" header="Sigla"></Column>
                <Column field="alias" header="Alias CPD"></Column>
                <Column field="ultimaModificacion" header="Última modificación"></Column>
                <Column field="accion" header="Acción">
                    <template #body>
                        <div class="flex gap-4">
                            <XButton variant="outlined" icon="edit-pencil" @click="navigateToEditChannel" />
                            <XButton variant="outlined" icon="user" @click="actionItems[0].command" />
                            <!-- <XButton variant="outlined" icon="privacy-policy" @click="actionItems[1].command" /> -->
                             <XButton variant="outlined" icon="privacy-policy" @click="testClick()" />
                        </div> 
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useChannels } from '~/componsables/useChannels';
const {
    fetchChannels 
} = useChannels();

function testClick(){
  fetchChannels()
}
const router = useRouter();
const actionItems = [
    {
        label: 'Historial participante',
        command: () => router.push('/admin/configuration/canales/HistorialParticipantes'),
    },
    {
        label: 'Historial certificados',
        command: () => router.push('/admin/configuration/canales/HistorialCertificados'),
    }
]

const selectedCanal = ref<any>(null)

const handleMainAction = (canalData: any) => {
    selectedCanal.value = canalData
}


const canales = ref([
    {
        codigo: 'f230fh0g3',
        nombres: 'Product Description 1',
        siglas:'ACCL',
        estado:'Activo',
        alias:'LPZ/SCZ',
        ultimaModificacion:'03/05/2024',
    },
    {
        codigo: 'f230fh0g3',
        nombres: 'Product Description 1',
        siglas:'INSTOCK',
        estado:'Inactivo',
        alias:'LPZ/SCZ',
        ultimaModificacion:'03/05/2024',
    },
    {
        canal: '2',
        codigo: 'f230fh0g3',
        nombres: 'Product Description 1',
        siglas:'INSTOCK',
        estado:'Activo',
        alias:'LPZ/SCZ',
        ultimaModificacion:'03/05/2024',
    },
    {
        canal: '1',
        codigo: 'rrqrqer',
        nombres: 'Bamboo Watch 12',
        siglas:'INSTOCK',
        estado:'Activo',
        alias:'LPZ/SCZ',
        ultimaModificacion:'03/05/2024',
    },
    {
        canal: '2',
        codigo: 'rrqrqer',
        nombres: 'Bamboo Watch 12',
        siglas:'INSTOCK',
        estado:'Inactivo',
        alias:'LPZ/SCZ',
        ultimaModificacion:'03/05/2024',
    },
]);

const navigateToEditChannel = () => {
    router.push('/admin/configuration/canales/EditarCanal');
};

</script>