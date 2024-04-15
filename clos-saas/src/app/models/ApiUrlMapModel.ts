export interface ApiUrlMap {
    readonly gateway: string;
    readonly services: {
        auth_service: string,
        domain_data_service: string,
        user_data_service: string,
        flow_manager_data_service: string,
        flow_manager_execution_service: string,
        case_management_service: string,
        dashboards_data_service: string,
        alert_configuration_data_service: string,
        decision_flow_execution_service: string,
        notification_data_service: string,
        audit_data_service: string,
        trades_data_service: string,
        alerts_data_service: string,
        report_data_service: string,
        attachment_data_service: string;
        market_data_service:string;
        loan_data_service:string;
        lo_monitor_service:string;
        clos_data_service:string;
        dynamic_dashboard_service:string;
        saas_service:string;
    }
}
