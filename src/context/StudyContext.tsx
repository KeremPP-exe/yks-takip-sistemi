import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type StudyLogModel } from "../types";

interface StudyContextType {
    studyLogs: Record<string, StudyLogModel>;
    addLog: (date: string, log: StudyLogModel) => void;
    deleteLog: (date: string) => void;
    
    // Checklist State
    checklist: Record<string, boolean>;
    toggleChecklist: (subjectId: string, topic: string) => void;
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

    const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
        try {
            const saved = localStorage.getItem("protracker_checklist");
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error("Failed to parse checklist", e);
            return {};
        }
    });

    useEffect(() => {
        localStorage.setItem("protracker_studyLogs", JSON.stringify(studyLogs));
    }, [studyLogs]);

    useEffect(() => {
        localStorage.setItem("protracker_checklist", JSON.stringify(checklist));
    }, [checklist]);

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

    const toggleChecklist = (subjectId: string, topic: string) => {
        setChecklist(prev => {
            const key = `${subjectId}-${topic}`;
            return { ...prev, [key]: !prev[key] };
        });
    };

    return (
        <StudyContext.Provider value={{ studyLogs, addLog, deleteLog, checklist, toggleChecklist }}>
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
