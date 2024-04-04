export interface ApiUrlMap {
    readonly gateway: string;
    readonly services: {
        auth_service: string,
        admin_service: string,
        saas_service:string,
    }
}
