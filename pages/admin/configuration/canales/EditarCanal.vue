<template>
  <Toast position="top-right" />
  <XConfirmDialog
    v-model="visible"
    icon="x:info-empty"
    icon-color="text-blue-600"
    title="Confirmar cambio de CPD">
    <template #message>
        <div class="space-y-2">
            <p>
              <span class="font-medium text-gray-700">¿Estás seguro de cambiar del </span>
              <span class="font-semibold"> {{ canalSeleccionado.cpd.label }} a {{ canalAntiguo.cpd.label }}</span>
              <span class="font-medium text-gray-700"> con ruta </span>
              <span>{{ canalAntiguo.ruta }}</span>
            </p>
        </div>
    </template>
    <template #buttons>
            <div class="flex gap-3">
                <XButton label="Cancelar" severity="secondary" outlined @click="visible=false"/>
                <XButton label="Confirmar" @click="saveConfirm" />
            </div>
    </template>  
  </XConfirmDialog>
  <XDialog 
    v-model:visible="visibleDialogCertificate" 
    maximizable 
    modal 
    header="Title dialog" 
    :style="{ width: '50rem' }" 
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #maximizeicon="{ maximized, class: iconClass }">
      <Icon 
        :name="maximized ? 'x:collapse' : 'x:expand'" 
        :class="[iconClass, 'w-12 h-12']"
      />
    </template>
  
    <p class="m-0">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
  </XDialog>
    <div>
        <div class="flex flex-col gap-8">
            <XHeader  title="Editar canal - Administradora de Cámaras de Compensación" />
            <span class="text-normal font-normal">Esta sección te permite modificar el centro de procesamiento, asegúrate de contar con los certificados y respaldos correspondientes.</span>
        </div>
        <div class="pt-12 flex flex-col gap-20">
            <div class="px-[calc((210/14)*1rem)] flex flex-col gap-12 ">
              <div class="flex justify-end">
                <XButton variant="outlined" icon="plus" label="Registrar certificado público" @click="visibleDialogCertificate = true"/>
              </div>
              <!-- DataTable -->
              <DataTable :value="rutas" class="w-full">
                  <Column field="ruta" header="Ruta" />
                  <Column field="cpd" header="CPD">
                      <template #body="{ data, index }">
                          <div class="flex flex-row gap-4">
                          <RadioButton name="canal" v-model="canal" :value="data.cpd.label" :inputId="`canal-${ index }`"/>
                          <Xlabel :for="`canal-${ index }`">{{ data.cpd.label }}</Xlabel>
                          </div>
                      </template>
                  </Column>
              </DataTable>
              <!-- Card Rutas -->
               <XCard v-if="visibleRutes" class="border border-secondary-400">
                  <template #content>
                      <div class="flex flex-row gap-6 border-gray-500">
                          <p class="font-bold text-gray-400">
                              Rutas:
                          </p>
                          <div class="flex flex-col">
                            <p class="text-gray-400 font-medium" 
                                v-for="(ruta,index) in canalSeleccionado.rutasIntegradas" :key="index">
                                <span> {{ ruta.name }}</span>
                            </p>
                          </div>
                      </div>
                  </template>
               </XCard>
               <!-- Actions -->
               <div v-if="visibleRutes" class="flex flex-col">
                <XDivider class="mb-16"/>
                <div class="w-full flex flex-row justify-end gap-6">
                    <XButton variant="outlined" label="Cancelar"/>
                    <XButton label="Guardar" @click="visible=true"/>
                </div>
               </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ProgressSpinner, Title } from '#components'
import { ref, computed, watch, reactive } from 'vue'
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const visibleDialogCertificate = ref(false)
const saveConfirm = async () => {
  console.log('hola')
  visible.value = false;
  await nextTick();
  toast.add({ 
      severity: 'success', 
    //   summary: 'Éxito', 
      detail: 'Nuevo CPD SCZ asignado correctamente', 
      life: 3000 
  });
}

const rutas = [
    { 
        ruta: 'https://admicamACCLcamcvdsvdsva', 
        cpd:{ label: 'LPZ', value: false},
        rutasIntegradas: [
            {name: 'https://admicamACCLcam/Servicio de mensajería', value: '12121'},
            {name: 'https://admicamACCLcam/Servicio de consulta', value: '22222'},
            {name: 'https://admicamACCLcam/Servicio de certificado', value: '3333'},
        ]
    },
    { 
        ruta: 'https://admicamACCLcamcvdsvdsvavsvdsvdsvs', 
        cpd:{ label: 'SCZ', value: true},
        rutasIntegradas: [
            {name: 'https://admicamACCLcam/Servicio de mensajería 1', value: '4444'},
            {name: 'https://admicamACCLcam/Servicio de consulta 2', value: '5555'},
            {name: 'https://admicamACCLcam/Servicio de certificado  3', value: '6666'},
        ]
    },
    // { ruta: 'https://admicamACCLcamcvdsvdsvavs', cpd:{ label: 'CBBA', value: true} },
    // { ruta: 'https://admicamACCLcamcvdsv', cpd:{ label: 'ASF', value: false} }
]

const canal = ref(null)
const canalSeleccionado = ref()
const canalAntiguo = ref()
let visibleRutes = ref(false)
watch(canal,(newCanal:any, oldCanal:any) => {
    console.log('new value',newCanal)
    console.log('old value',oldCanal)
    canalAntiguo.value = oldCanal
    if(oldCanal != null) visibleRutes.value =true
    rutas.forEach(element => {
        if(element.cpd.label == newCanal) canalSeleccionado.value = element
    });
    rutas.forEach(element => {
        if(element.cpd.label == oldCanal) canalAntiguo.value = element
    });
    console.log(canalSeleccionado.value.ruta)
})

onMounted(() => {
  console.log(canal.value)
  const seleccionado = rutas.find(r => r.cpd.value === true)
  if (seleccionado) canal.value = seleccionado.cpd.label
})
// const editarCanal = ref([
//     { rutaCanal: 'https://admicamACCLcam... ', aliasCPD: 'COD001', ultimamodificacion: true},
//     { rutaCanal: 'https://admicamACCLcam...', aliasCPD: 'COD002', ultimamodificacion: false},
// ])

const visible = ref(false)



const fileStates = reactive(new Map())
const isVerifying = ref(false)
const isVerified = ref(false)
const verificationProgress = ref(0)

// Computed para verificar si hay archivos cargados
const hasFilesLoaded = computed(() => {
  return Array.from(fileStates.values()).some(state => state.isLoaded)
})

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileKey = (file) => {
  return `${file.name}-${file.size}-${file.lastModified}`
}

const getFileStatus = (file) => {
  const fileKey = getFileKey(file)
  return fileStates.get(fileKey) || { 
    isLoaded: false, 
    progress: 0 
  }
}

const onFileSelect = (event) => {
  // Reiniciar estados de verificación al seleccionar nuevo archivo
  isVerifying.value = false
  isVerified.value = false
  verificationProgress.value = 0
  
  // Inicializar estado para cada archivo
  event.files.forEach(file => {
    const fileKey = getFileKey(file)
    if (!fileStates.has(fileKey)) {
      fileStates.set(fileKey, {
        isLoaded: false,
        progress: 0,
        file: file
      })
      
      // Simular carga del archivo
      simulateFileLoading(fileKey)
    }
  })
}

const simulateFileLoading = (fileKey) => {
  let progress = 0
  const interval = setInterval(() => {
    progress += 20
    
    // Actualizar progreso de carga
    if (fileStates.has(fileKey)) {
      const currentState = fileStates.get(fileKey)
      fileStates.set(fileKey, {
        ...currentState,
        progress: progress
      })
    }
    
    if (progress >= 100) {
      clearInterval(interval)
      
      // Marcar como cargado completo
      if (fileStates.has(fileKey)) {
        const currentState = fileStates.get(fileKey)
        fileStates.set(fileKey, {
          ...currentState,
          isLoaded: true,
          progress: 100
        })
      }
    }
  }, 200)
}

const verifyCertificate = (files) => {
  // Iniciar verificación
  isVerifying.value = true
  isVerified.value = false
  verificationProgress.value = 0
  
  console.log('Iniciando verificación de certificado...', files)
  
  // Simular proceso de verificación
  simulateVerification()
}

const simulateVerification = () => {
  let progress = 0
  const interval = setInterval(() => {
    progress += 10
    verificationProgress.value = progress
    
    if (progress >= 100) {
      clearInterval(interval)
      
      // Verificación completada
      isVerifying.value = false
      isVerified.value = true
      
      console.log('Certificado verificado exitosamente')
    }
  }, 300) // Simular 3 segundos de verificación
}

const resetUploadState = () => {
  // Reiniciar todos los estados
  fileStates.clear()
  isVerifying.value = false
  isVerified.value = false
  verificationProgress.value = 0
}

// Reiniciar estado cuando se abre/cierra el diálogo
watch(visible, (newVal) => {
  if (!newVal) {
    resetUploadState()
  }
})


const certificado = ref([
    { nroserie: '10A5DS100F567JWEE', validodesde: '12/05/2025', validohasta:'12/05/2026' },
    
]);
</script>