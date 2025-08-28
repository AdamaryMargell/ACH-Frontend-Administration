<template>
    <div>
    <XConfirmDialog
            v-model:visible="visible"
            icon="x:warning-circle"
            icon-color="text-yellow-500"
            title="Reseteo de contraseña"
            :confirm-button="{ label: 'Aceptar', action: handleSave}"
            :cancel-button="{ label: 'Cancelar', action: closeModal }"
        >
        <template #message>
            <div class="space-y-2">
                <p>¿Estás seguro de resetear la contraseña de {{ userData?.fullname }}?
                    Se enviará la nueva contraseña a su correo electrónico <span class="font-semibold">{{ userData?.email }}</span></p>
            </div>
        </template>
    </XConfirmDialog>
    </div>
</template>

<script setup lang="ts">
import { useUserService } from '~/componsables/useUsers';
import type { UserFormData, UserModalData } from './types';

interface Props {
    modelValue: boolean
    userData?: UserModalData
}

interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'save', userData: UserFormData): void
}

const visible = defineModel<boolean>()
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { saveResetPassword } = useUserService()

const handleSave = async (): Promise<void>  => {
    const success = await saveResetPassword(props.userData.code)
    if (success) {
        emit('save', props.userData)
    }
    visible.value = false
}

const closeModal = () => {
    visible.value = false
}

</script>