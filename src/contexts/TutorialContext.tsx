import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { tutorialSteps } from '@/data/tutorialSteps';

export interface TutorialStep {
    target: string; // CSS selector or data-tutorial-id
    title: string;
    description: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialContextType {
    isActive: boolean;
    currentPage: string | null;
    currentStep: number;
    totalSteps: number;
    startTutorial: (pageName: string) => void;
    nextStep: () => void;
    prevStep: () => void;
    skipTutorial: () => void;
    completeTutorial: () => void;
    hasCompletedTutorial: (pageName: string) => boolean;
    showWelcome: boolean;
    setShowWelcome: (show: boolean) => void;
    wantsTutorial: boolean;
    setWantsTutorial: (wants: boolean) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

const STORAGE_KEY = 'securepyme_tutorial_completed';
const WELCOME_KEY = 'securepyme_tutorial_welcome_shown';

export function TutorialProvider({ children }: { children: ReactNode }) {
    const [isActive, setIsActive] = useState(false);
    const [currentPage, setCurrentPage] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [completedPages, setCompletedPages] = useState<Set<string>>(new Set());
    const [showWelcome, setShowWelcome] = useState(false);
    const [wantsTutorial, setWantsTutorial] = useState(false);

    // ALWAYS show welcome dialog for user testing
    // Route checking is done in TutorialWelcome component (which has Router context)
    useEffect(() => {
        setShowWelcome(true);
    }, []);



    const startTutorial = (pageName: string) => {
        setCurrentPage(pageName);
        setCurrentStep(0);
        setIsActive(true);
    };

    const nextStep = () => {
        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(0, prev - 1));
    };

    const skipTutorial = () => {
        setIsActive(false);
        setCurrentPage(null);
        setCurrentStep(0);
    };

    const completeTutorial = () => {
        if (currentPage) {
            setCompletedPages(prev => new Set([...prev, currentPage]));
        }
        setIsActive(false);
        setCurrentPage(null);
        setCurrentStep(0);
    };

    const hasCompletedTutorial = (pageName: string) => {
        return completedPages.has(pageName);
    };

    // Get total steps from tutorial definitions
    const totalSteps = currentPage && tutorialSteps[currentPage]
        ? tutorialSteps[currentPage].length
        : 0;

    return (
        <TutorialContext.Provider
            value={{
                isActive,
                currentPage,
                currentStep,
                totalSteps,
                startTutorial,
                nextStep,
                prevStep,
                skipTutorial,
                completeTutorial,
                hasCompletedTutorial,
                showWelcome,
                setShowWelcome,
                wantsTutorial,
                setWantsTutorial,
            }}
        >
            {children}
        </TutorialContext.Provider>
    );
}

export function useTutorial() {
    const context = useContext(TutorialContext);
    if (!context) {
        throw new Error('useTutorial must be used within TutorialProvider');
    }
    return context;
}
