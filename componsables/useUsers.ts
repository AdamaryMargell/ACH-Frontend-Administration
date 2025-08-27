import type { ModalMode, ServiceError, UserDetailResponse, UserFormData, UserModalData, UserRequest } from "~/features/users/types";
import { userService } from "~/services/userService";

export function useUserModal() {
    // State
    const modalUser = ref(false);
    const mode = ref<ModalMode>('create')
    const loading = ref(false);

    const userDetails = ref<UserFormData>({
        code: '',
        name: '',
        email: '',
        alias: '',
        rol: '',
        numberPhone: '',
        countryCode: '+591',
        isActive: true
    });

    // Computed
    const isEditMode = computed(() => mode.value === 'edit')
    const modalTitle = computed(() =>
        isEditMode.value ? 'Editar Usuario' : 'Agregar nuevo usuario'
    )

    // Methods
    const openModal = (modalMode: ModalMode, userData?: UserModalData) => {
        mode.value = modalMode
        modalUser.value = true

        if (modalMode === 'edit' && userData) {
            loadUserData(userData)
        } else {
            resetForm()
        }
    }

    const closeModal = () => {
        modalUser.value = false
        mode.value = 'create'
        resetForm()
    }

    const loadUserData = (userData: UserModalData) => {
        userDetails.value = {
            code: userData.code || '',
            name: userData.fullname || '',
            email: userData.email || '',
            alias: userData.alias || '',
            rol: userData.roleCode || '',
            numberPhone: userData.phoneNumber?.number || '',
            countryCode: userData.phoneNumber?.countryCode || '+591',
            isActive: userData.isActive ?? true
        }
    }

    const resetForm = () => {
        userDetails.value = {
            code: '',
            name: '',
            email: '',
            alias: '',
            rol: '',
            numberPhone: '',
            countryCode: '+591',
            isActive: true
        }
    }

    return {
        // State
        modalUser,
        mode,
        loading,
        userDetails,

        // Computed
        isEditMode,
        modalTitle,

        // Methods
        openModal,
        closeModal,
        loadUserData, // ← Esta función faltaba en el return
        resetForm
    }
}

export function useUserService() {
    const toast = useToast()

    const showToast = (message: any) => {
        toast.add(message)
    }

    const loadUserDetails = async (code: string): Promise<UserDetailResponse | null> => {
        try {
            return await userService.getUserByCode(code)
        } catch (error) {
            console.error('Error loading user details:', error)
            const serviceError = error as ServiceError
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: serviceError.message || 'No se pudieron cargar los detalles del usuario',
                life: 5000
            })
            return null
        }
    }
    const saveUser = async (userData: UserFormData, isEdit: boolean): Promise<boolean> => {
        try {
            const apiPayload: UserRequest = {
                code: userData.code,
                email: userData.email,
                alias: userData.alias,
                fullname: userData.name,
                phone: {
                    countryCode: userData.countryCode,
                    number: userData.numberPhone,
                    isMobile: true,
                    verificationHash: ""
                },
                roleCode: userData.rol
            }

            if (isEdit) {
                const response = await userService.updateUser(apiPayload)

                // Verificar si la operación fue exitosa según la estructura de tu respuesta
                if (response.wasSaved) {
                    showToast({
                        severity: 'success',
                        summary: 'Cambios guardados',
                        detail: '',
                        life: 4000
                    })
                    return true
                } else {
                    showToast({
                        severity: 'error',
                        summary: 'Error',
                        detail: response.message || response.description || 'No se pudo actualizar el usuario',
                        life: 8000
                    })
                    return false
                }
            } else {
                const response = await userService.createUser(apiPayload)

                // Verificar si la operación fue exitosa según la estructura de tu respuesta
                if (response.wasSaved) {
                    showToast({
                        severity: 'success',
                        summary: 'Nuevo usuario',
                        detail: 'Se creo el usuario exitosamente.',
                        life: 8000
                    })
                    return true
                } else {
                    showToast({
                        severity: 'error',
                        summary: 'Error',
                        detail: response.message || response.description || 'No se pudo crear el usuario',
                        life: 5000
                    })
                    return false
                }
            }
        } catch (error) {
            console.error('Error saving user:', error)
            const serviceError = error as ServiceError
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: serviceError.message || `Error al ${isEdit ? 'actualizar' : 'crear'} el usuario`,
                life: 5000
            })
            return false
        }
    }

    const saveResetPassword = async (code: string): Promise<boolean> => {
        try {
            const response = await userService.resetPasswordUser(code)

            if (response.wasSaved) {
                showToast({
                    severity: 'success',
                    summary: 'Contraseña reseteada',
                    detail: 'Se ha enviado un correo con la nueva contraseña.',
                    life: 4000
                })
                return true
            } else {
                showToast({
                    severity: 'error',
                    summary: 'Error',
                    detail: response.message || response.description || 'No se pudo resetear la contraseña',
                    life: 8000
                })
                return false
            }
        } catch (error) {
            console.error('Error reseteando contraseña:', error)
            const serviceError = error as ServiceError
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: serviceError.message || 'Error al resetear la contraseña',
                life: 8000
            })
            return false
        }
    }
    return {
        loadUserDetails,
        saveUser,
        saveResetPassword,
        showToast
    }
}