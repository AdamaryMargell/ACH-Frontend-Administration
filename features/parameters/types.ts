export interface ParameterListItem {
    systemAcronym?: string
    code?: string
    value?: string
    dataType?: string
    description?: string
}

export interface ParameterModalData {
    systemAcronym?: string
    code?: string
    value?: string
    dataType?: string
    description?: string
}

//Datos para editar 
export interface ParameterRequest {
    code: string;
    value: string;
}



export interface ParameterDetailResponse {
    code: string;
    value: string;
    dataType: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    createdByUserId: number;
    lastChangeNumber: number;
    updatedAt: string;
    updatedByUserId: number;
}

export interface ParameterSaveResponse {
    wasSaved: boolean
    wasNew: boolean
    summary: string
    description: string
    savedBy: string
    savedAt: string
    traceId: string
}



