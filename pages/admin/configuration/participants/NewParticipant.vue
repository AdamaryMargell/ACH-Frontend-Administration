<template>
    <div class="flex-col gap-20">
        <div class="flex flex-col gap-8">
            <XHeader title="Nuevo participante destinatario" 
                :breadcrumb-items="items"
                :show-breadcrumb="true"
            />
            <span class="text-normal font-normal">Complete los datos requeridos para registrar un nuevo participante destinatario y cargue los certificados correspondientes. </span>
        </div>
        <div class="flex flex-col gap-20">
            <Stepper value="1" class="mt-20 basis-[100rem]">
                <StepList>
                    <Step value="1">Datos generales</Step>
                    <Step value="2">Cargar certificados</Step>
                </StepList>
                <StepPanels>
                    <StepPanel v-slot="{ activateCallback }" value="1">
                        <div class="flex flex-col h-48">
                            <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content I</div>
                        </div>
                        <div class="flex pt-6 justify-end">
                            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('2')" />
                        </div>
                    </StepPanel>
                </StepPanels>
            </Stepper> 
        </div>
    </div>
</template>

<script setup lang="ts">
const items = ref([
    { label: 'Inicio'},
    { label: 'Configuración' },
    { label: 'Participantes' }
])

</script>

<style scoped>

</style>