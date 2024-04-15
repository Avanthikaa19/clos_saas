export class SystemStatus {
    
    timestamp: { epochMilli: number };
    memoryTotalMb: number;
    memoryUsedMb: number;
    memoryFreeMb: number;
    cpuProcessorsCount: number;
    cpuUsagePercent: number;
    dbConnectionsActive: number;
    dbConnectionsIdle: number;
    totalThreads: number;
    timestampDate: Date;

}