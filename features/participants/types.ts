export type PaymentSystemAcronym = 'ACCL' | 'MLD' | 'LIP' | 'UNILINK' | string; 
export type StatusCode = 'ACTIVE' | 'INACTIVE'  | string; 

export interface ParticipantsList{
    ownParticipants?: ParticipantsDetail[];
    externalParticipants?: ParticipantsDetail[];
}

export interface ParticipantsDetail{
    paymentSystemAcronym: PaymentSystemAcronym;
    paymentGatewayCode: string;
    code: string;
    name: string;
    acronym: string;
    isSelf: boolean;
    statusCode: StatusCode;
    urlIcon: string;
    paymentSystems?: PaymentSystems[];
    publicCertificates?: string[];
    privateCertificates?: string[];
}

export interface PaymentSystems{
    code: string;
    paymentSystemAcronym: string;
}