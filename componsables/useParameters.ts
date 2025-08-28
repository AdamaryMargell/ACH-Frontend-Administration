import type { ParameterDetailResponse, ParameterModalData, ParameterRequest } from "~/features/parameters/types"
import type { ModalMode, ServiceError } from "~/features/users/types"
import { parametersService } from "~/services/parametersService"

export function useParameterService() {
    const toast = useToast()

    const showToast = (message: any) => {
        toast.add(message)
    }

    const loadParameterDetails = async (parameterCode: string): Promise<ParameterDetailResponse | null> => {
        try {
            return await parametersService.getParameterByCode(parameterCode)
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

    const editParameter = async (parameterData: ParameterRequest): Promise<boolean> => {
        try {
            const apiPayload: ParameterRequest = {
                code: parameterData.code,
                value: parameterData.value,
            }

            const response = await parametersService.updateParameter(apiPayload)
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
    return {
        loadParameterDetails,
        showToast
    }
}