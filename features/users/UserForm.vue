<template>
    <XForm @submit="onSubmit" class="flex flex-col gap-10">
        <UserFields
            v-if="isEdit"
            v-model="formData.isActive"
        />

        <XInputText 
            v-model="formData.code" 
            name="codigo"
            label="Código de usuario" 
            label-required
            placeholder="Ingresa un código de usuario"
            :disabled="isEdit"
        />

        <XInputText 
            v-model="formData.name" 
            name="nombre"
            label="Nombre completo" 
            label-required
            placeholder="Ingresa los nombres y apellidos"
        />

        <XInputText 
            v-model="formData.email" 
            name="correo"
            label="Correo electrónico" 
            label-required
            placeholder="Ingresa el correo" 
        />

        <XInputText 
            v-model="formData.alias" 
            name="alias"
            label="Alias" 
            label-required
            placeholder="Ingresa un alias" 
        />

        <XSelect 
            v-model="formData.rol" 
            label="Rol" 
            label-required
            :options="roles" 
            option-label="label" 
            option-value="value"
            placeholder="Selecciona el rol"
            name="rol"
            :rules="requiredRule" 
        />

        <XPhoneInput 
            v-model="formData.numberPhone"
            name="telefono"
            label="Número de celular" 
            label-required
            placeholder="Ingresa el número"
            :rules="requiredRule" 
        />

        <div class="flex flex-col gap-4 col-span-2">
            <XDivider />
            <div class="flex justify-end gap-4">
                <XButton 
                    label="Cancelar" 
                    variant="outlined" 
                    class="!w-[130px]" 
                    @click="$emit('cancel')" 
                    :disabled="loading"
                />
                <XButton 
                    :label="isEdit ? 'Guardar' : 'Crear'" 
                    class="!w-[130px]" 
                    type="submit"
                    :loading="loading"
                />
            </div>
        </div>
    </XForm> 
</template>

<script setup>
import { ref } from 'vue'
import UserFields from '~/components/fields/UserFields.vue';

const props = defineProps({
    userData: { type: Object, default: () => ({}) },
    isEdit: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
})

const emits = defineEmits(['submit', 'cancel'])

const requiredRule = (value) => {
    console.log('Validating:', value);
    return value !== null && value !== undefined && value !== '' 
        ? true 
        : 'El campo es requerido'
}

const formData = ref({
    code: '',
    name: '',
    email: '',
    alias: '',
    rol: '',
    numberPhone: '',
    countryCode: '+591',
    isActive: true
})

watch(() => props.userData, (newData) => {
    if (newData && Object.keys(newData).length > 0) {
        formData.value = {
            code: newData.code || '',
            name: newData.name || '',
            email: newData.email || '',
            alias: newData.alias || '',
            numberPhone: newData.numberPhone || '',
            countryCode: newData.countryCode || '+591',
            rol: newData.rol || '', // Cambié roleCode por rol
            isActive: newData.isActive ?? true
        }
    } else {
        formData.value = {
            code: '',
            name: '',
            email: '',
            alias: '',
            rol: '',
            numberPhone: '',
            countryCode: '+591',
            isActive: true,
        }
    }
}, { immediate: true, deep: true });

const roles = [
    { label: 'Administrador', value: 'ADMIN' },
]

const onSubmit = () => {
    const apiPayload = {
        code: formData.value.code,
        email: formData.value.email,
        alias: formData.value.alias,
        fullname: formData.value.name,
        phone: {
            countryCode: formData.value.countryCode,
            number: formData.value.numberPhone,
            isMobile: true,
            verificationHash: ""
        },
        roleCode: formData.value.rol,
        isActive: formData.value.isActive
    }
    emits('submit', apiPayload)
}
</script>