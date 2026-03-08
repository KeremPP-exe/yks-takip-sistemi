export type SubjectScores = {
    [key: string]: number;
};

export interface TrialModel {
    id: string;
    name: string;
    date: string; // ISO String
    tyt: {
        turkish: number;
        social: number;
        math: number;
        science: number;
        total: number;
    };
    ayt: {
        math: number;
        physics: number;
        chemistry: number;
        biology: number;
        literature: number;
        history: number;
        geography: number;
        total: number;
    };
}

export interface TargetScoresModel {
    university?: string;
    department?: string;
    tyt: {
        turkish: number;
        social: number;
        math: number;
        science: number;
    };
    ayt: {
        math: number;
        physics: number;
        chemistry: number;
        biology: number;
        literature: number;
        history: number;
        geography: number;
    };
}

export interface StudyLogModel {
    date: string; // YYYY-MM-DD
    durationHours: number;
    durationMinutes: number;
    subjects: string[];
    notes: string;
}
export type UserField = "SAY" | "EA";
