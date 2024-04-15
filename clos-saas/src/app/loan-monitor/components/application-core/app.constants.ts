import { TMRModule } from "./app.models";


export const app_header_height = 60;

export const ReportPublisherModule: TMRModule = new TMRModule('Report Publisher', 'View & Download reports.', '/reports/default', 'icon', 'report-publisher', 'cyan', false);
export const ReconModule: TMRModule = new TMRModule('FACT – Reconciliations', 'Reconcile reports & View the results online.', '/recon', 'icon', 'reconciliations', 'orange', false);
export const FlowManagerModule: TMRModule = new TMRModule('Data Flow Manager', 'To Automate Business and Technology Processes & Highly Flexible Workflows Management.', '/flow-manager', 'icon', 'flow-manager', 'crimson', false);
export const BdoneDealFlowsModule: TMRModule = new TMRModule('FX Deal Flows', 'Insert, View & Manage FX deals flowing through external systems.', '/bdone', 'icon', 'deal-flow', 'pink', false);
export const SCFNostroFlowsModule: TMRModule = new TMRModule('SCF Nostro Deal Flows', 'Insert, View & Manage SCF deals for Nostro Management', '/scf', 'icon', 'deal-flow', 'violet', false);
export const MarketDataPublisherModule: TMRModule = new TMRModule('Market Data Publisher', 'Set market data adjustments and publish Real-Time/EOD', '/feed/market', 'icon', 'market-data-publisher', 'dimgrey', false);
export const ReportModule: TMRModule = new TMRModule('Custom Reports', 'Compute & download reports tailor made for specific purposes.', '/custom_report', 'icon', 'report', '#ff0b55', false);
export const DashboardsModule: TMRModule = new TMRModule('Real-Time BAM Dashboards', 'Business Intelligence & Realtime Statistics.', '/dashboards', 'icon', 'dashboards', 'orange', false);
export const ScfProfitModule: TMRModule = new TMRModule('SCF Profit Sharing', 'Insert, View & Manage SCF deals for Profit Sharing.', '/scf-profit', 'icon', 'scf-profit', 'crimson', false);
export const PlSellDownModule: TMRModule = new TMRModule('P & L Sell-Down', 'Insert, View & Manage P & L Sell-Down  deals.', '/pls', 'icon', 'pl-selldown', 'blue', false);
export const MarketData: TMRModule = new TMRModule('Market-Data', 'View Market Rates.', '/market-data', 'icon', 'market-data', 'blue', false);
export const FlowControlModule: TMRModule = new TMRModule('Flow-Control', 'View and Control Flow data reports.', '/flow-control', 'icon', 'flow-control', 'violet', false);
export const ReportsPortalModule: TMRModule = new TMRModule('Reports Portal', 'Create, generate & download reports tailor made for specific purposes.', '/reports_portal', 'icon', 'report-portal', '#ff0b55', false);
export const CustomeMapping: TMRModule = new TMRModule('Custom Mapping', 'Monitors and Detects Activities for Illegal Trading Practices.', '/data', 'icon', 'custome-mapping', 'blue', false);
//NEW
export const FlowManagerTradesModule: TMRModule = new TMRModule('Trades Explorer', 'View & Manage deals flowing through the system.', '/trades', 'icon', 'trades', 'crimson', false);
export const UserAccessMatrixModule: TMRModule = new TMRModule('User Access Matrix', 'To View and Compare the data and download the Reports.', '/uam', 'icon', 'user-access-matrix', 'crimson', false);

export const DataVault: TMRModule = new TMRModule('Data Vault', 'Enterprise Data Management, Datawarehouse and Reporting Solutions.', '/datavault', 'icon', 'data-vault', 'red', false);
export const TreasuryVision: TMRModule = new TMRModule('Treasury Vision', 'Digitalizing Sales and Customer Engagement Platform.', '/treasury-vision', 'icon', 'tresury-vision', 'violet', false);
export const TradeSurveillance: TMRModule = new TMRModule('Trade Surveillance', 'Monitors and Detects Activities for Illegal Trading Practices.', '', 'icon', 'trade-survy', 'blue', false);
export const API = 'dot-api-0.15.7a';
