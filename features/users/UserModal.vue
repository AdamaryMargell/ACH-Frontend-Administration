<template>
    <XDialog 
        v-model:visible="modalUser" 
        modal
        :closable="false"
        :header="modalTitle"
        :style="{ width: '500px !important' }" 
    > 
        <UserForm
            :userData="userDetails"
            :isEdit="isEditMode"
            :loading="loading || loadingDetails"
            @submit="handleSubmit"
            @cancel="handleCancel"
        />
    </XDialog>
    <Toast position="top-right">
        <template #message="{ message }">
            <Icon 
                name="x:check-circle" 
                class="p-toast-message-icon"
            />
            <div class="p-toast-message-text">
                <span class="p-toast-summary">{{ message.summary }}</span>
                <span class="p-toast-detail">{{ message.detail }}</span>
            </div>
        </template>
    </Toast>

</template>
<script setup lang="ts">
import type { ModalMode, UserFormData, UserModalData } from './types';
import { useUserModal, useUserService } from '~/componsables/useUsers';
import UserForm from './UserForm.vue';

interface Props {
    modelValue: boolean
    userData?: UserModalData
    mode?: ModalMode
}

interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'save', userData: UserFormData): void
}

const props = withDefaults(defineProps<Props>(), {
    mode: 'create'
})

const emit = defineEmits<Emits>()

// Usar el composable
const {
    modalUser,
    mode,
    loading,
    userDetails,
    isEditMode,
    modalTitle,
    openModal,
    closeModal,
    loadUserData,
    resetForm
} = useUserModal();


const { saveUser, loadUserDetails } = useUserService()

const loadingDetails = ref(false)

// Watch para sincronizar con el prop modelValue
watch(() => props.modelValue, async (newValue) => {
    if (newValue) {
        mode.value = props.mode
        modalUser.value = true
        
        if (props.mode === 'edit' && props.userData?.code) {
            // Cargar detalles completos desde la API para modo edición
            await loadFullUserDetails(props.userData.code)
        } else if (props.mode === 'edit' && props.userData) {
            // Usar datos proporcionados si no hay código
            loadUserData(props.userData)
        } else {
            // Modo crear - resetear formulario
            resetForm()
        }
    } else {
        closeModal()
    }
})

// Watch para emitir cambios del modal al padre
watch(modalUser, (newValue) => {
    emit('update:modelValue', newValue)
})

const loadFullUserDetails = async (code: string): Promise<void> => {
    loadingDetails.value = true
    
    try {
        const userDetail = await loadUserDetails(code)
        
        if (userDetail) {
            userDetails.value = {
                code: userDetail.code,
                name: userDetail.fullname,
                email: userDetail.email,
                alias: userDetail.alias,
                rol: userDetail.roleCode,
                numberPhone: userDetail.phoneNumber?.number || '',
                countryCode: userDetail.phoneNumber?.countryCode || '+591',
                isActive: userDetail.isActive
            }
        }
    } finally {
        loadingDetails.value = false
    }
}

const handleSubmit = async (formData: UserFormData): Promise<void> => {
    loading.value = true
    try {
        
        const success = await saveUser(formData, isEditMode.value)
        
        if (success) {
            emit('save', formData)
            handleCancel()
        }
    } finally {
        loading.value = false
    }
}

const handleCancel = (): void => {
    closeModal()
}
</script>