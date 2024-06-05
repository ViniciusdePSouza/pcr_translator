export type CheckedEmailStatus = 'valid' | 'invalid'

export interface EmailBatchResponseProps {
    address: string;
    status: CheckedEmailStatus;
    sub_status: string;
    free_email?: boolean;
    did_you_mean?: any;
    account?: string;
    domain?: string;
    domain_age_days?: string;
    smtp_provider?: string;
    mx_found?: string;
    mx_record?: string;
    firstname?: any;
    lastname?: any;
    gender?: any;
    country?: any;
    region?: any;
    city?: any;
    zipcode?: any;
    processed_at?: string;
}

export interface CheckedEmailProps {
    emailAddress: string;
    status: CheckedEmailStatus;
    sub_status: string;
}