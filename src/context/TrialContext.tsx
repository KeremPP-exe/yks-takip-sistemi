import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type TrialModel, type TargetScoresModel, type UserField } from "../types";

interface TrialContextType {
    trials: TrialModel[];
    obp: number;
    userField: UserField;
    targetScores: TargetScoresModel;
    setObp: (val: number) => void;
    setUserField: (val: UserField) => void;
    setTargetScores: (val: TargetScoresModel) => void;
    addTrial: (trial: TrialModel) => void;
    updateTrial: (id: string, trial: TrialModel) => void;
    deleteTrial: (id: string) => void;
}

const TrialContext = createContext<TrialContextType | undefined>(undefined);

export function TrialProvider({ children }: { children: ReactNode }) {
    const [trials, setTrials] = useState<TrialModel[]>(() => {
        try {
            const saved = localStorage.getItem("protracker_trials");
            if (!saved) return [];
            const parsed = JSON.parse(saved);
            // Migration: Ensure all trials have new AYT fields
            return parsed.map((t: any) => ({
                ...t,
                ayt: {
                    math: 0, physics: 0, chemistry: 0, biology: 0,
                    literature: 0, history: 0, geography: 0,
                    ...t.ayt
                }
            }));
        } catch (e) {
            console.error("Failed to parse trials from local storage", e);
            return [];
        }
    });

    const [obp, setObpState] = useState<number>(() => {
        try {
            const saved = localStorage.getItem("protracker_obp"); return saved ? parseFloat(saved) : 85;
        } catch (e) {
            return 85; // default OBP
        }
    });

    const [userField, setUserFieldState] = useState<UserField>(() => {
        try {
            const saved = localStorage.getItem("protracker_userField") as UserField;
            return saved === "EA" ? "EA" : "SAY";
        } catch (e) {
            return "SAY";
        }
    });

    const defaultTargetScores: TargetScoresModel = {
        university: "",
        department: "",
        tyt: { turkish: 30, social: 15, math: 20, science: 10 },
        ayt: {
            math: 20,
            physics: 5,
            chemistry: 5,
            biology: 5,
            literature: 18,
            history: 7,
            geography: 4
        }
    };

    const [targetScores, setTargetScoresState] = useState<TargetScoresModel>(() => {
        try {
            const saved = localStorage.getItem("protracker_targets");
            if (!saved) return defaultTargetScores;
            const parsed = JSON.parse(saved);
            // Migration: Ensure all target subject keys exist
            return {
                ...defaultTargetScores,
                ...parsed,
                tyt: { ...defaultTargetScores.tyt, ...parsed.tyt },
                ayt: { ...defaultTargetScores.ayt, ...parsed.ayt }
            };
        } catch (e) {
            return defaultTargetScores;
        }
    });

    useEffect(() => {
        localStorage.setItem("protracker_trials", JSON.stringify(trials));
    }, [trials]);

    useEffect(() => {
        localStorage.setItem("protracker_obp", obp.toString());
    }, [obp]);

    useEffect(() => {
        localStorage.setItem("protracker_userField", userField);
    }, [userField]);

    useEffect(() => {
        localStorage.setItem("protracker_targets", JSON.stringify(targetScores));
    }, [targetScores]);

    const setObp = (val: number) => setObpState(val);
    const setUserField = (val: UserField) => setUserFieldState(val);
    const setTargetScores = (val: TargetScoresModel) => setTargetScoresState(val);

    const addTrial = (trial: TrialModel) => {
        setTrials((prev) => [...prev, trial].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    };

    const updateTrial = (id: string, updated: TrialModel) => {
        setTrials((prev) =>
            prev.map((trial) => (trial.id === id ? updated : trial)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        );
    };

    const deleteTrial = (id: string) => {
        setTrials((prev) => prev.filter((trial) => trial.id !== id));
    };

    return (
        <TrialContext.Provider value={{ trials, obp, userField, targetScores, setObp, setUserField, setTargetScores, addTrial, updateTrial, deleteTrial }}>
            {children}
        </TrialContext.Provider>
    );
}

export function useTrialContext() {
    const context = useContext(TrialContext);
    if (context === undefined) {
        throw new Error("useTrialContext must be used within a TrialProvider");
    }
    return context;
}
