import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type StudyLogModel } from "../types";

interface StudyContextType {
    studyLogs: Record<string, StudyLogModel>;
    addLog: (date: string, log: StudyLogModel) => void;
    deleteLog: (date: string) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: ReactNode }) {
    const [studyLogs, setStudyLogs] = useState<Record<string, StudyLogModel>>(() => {
        try {
            const saved = localStorage.getItem("protracker_studyLogs");
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error("Failed to parse study logs", e);
            return {};
        }
    });

    useEffect(() => {
        localStorage.setItem("protracker_studyLogs", JSON.stringify(studyLogs));
    }, [studyLogs]);

    const addLog = (date: string, log: StudyLogModel) => {
        setStudyLogs(prev => ({ ...prev, [date]: log }));
    };

    const deleteLog = (date: string) => {
        setStudyLogs(prev => {
            const newLogs = { ...prev };
            delete newLogs[date];
            return newLogs;
        });
    };

    return (
        <StudyContext.Provider value={{ studyLogs, addLog, deleteLog }}>
            {children}
        </StudyContext.Provider>
    );
}

export function useStudyContext() {
    const context = useContext(StudyContext);
    if (context === undefined) {
        throw new Error("useStudyContext must be used within a StudyProvider");
    }
    return context;
}
