import { StoredTarget } from './target';

export interface TelemetryTarget {
    group: string;
    studentsNames: string[];
}

export interface TargetsTelemetry {
    targets: TelemetryTarget[];
    timestamp: number;
    sessionId: string;
    sessionMs: number;
}

export interface OptionLike {

}