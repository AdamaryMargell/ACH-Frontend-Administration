export interface UserRequest {
    code: string
    email: string
    alias: string
    fullname: string
    phone: {
        countryCode: string
        number: string
        isMobile: boolean
        verificationHash: string
    }
    roleCode: string
}

export interface PhoneNumber {
    countryCode: string
    number: string
    isMobile: boolean
    isVerified: boolean
}

export interface UserDetailResponse {
    code: string
    email: string
    alias: string
    fullname: string
    roleCode: string
    isActive: boolean
    statusCode: string
    phoneNumber: PhoneNumber
}

export interface UserListItem {
    code: string
    email: string
    alias: string
    fullname: string
    roleCode: string
    roleDescription: string
    isActive: boolean
    statusCode: string
    statusDescription: string
}

export interface UsersListResponse {
    users: UserListItem[]
}

export interface UserSaveResponse {
    wasSaved: boolean
    wasNew: boolean
    summary: string
    description: string
    savedBy: string
    savedAt: string
    traceId: string
}

export interface UserFormData {
    code: string
    name: string
    email: string
    alias: string
    rol: string
    numberPhone: string
    countryCode: string
    isActive: boolean
}

export interface UserModalData {
    code?: string
    fullname?: string
    email?: string
    alias?: string
    roleCode?: string
    phoneNumber?: PhoneNumber
    isActive?: boolean
}


export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
export type ModalMode = 'create' | 'edit'

export interface ServiceError {
    message: string
    code?: string
    traceId?: string
}