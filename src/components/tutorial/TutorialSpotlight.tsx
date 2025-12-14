import { useEffect, useState } from 'react';
import { useTutorial } from '@/contexts/TutorialContext';
import { tutorialSteps } from '@/data/tutorialSteps';

export function TutorialSpotlight() {
    const { isActive, currentPage, currentStep } = useTutorial();
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    // Scroll to element when step changes
    useEffect(() => {
        if (!isActive || !currentPage) return;

        const steps = tutorialSteps[currentPage];
        if (!steps || currentStep >= steps.length) return;

        const step = steps[currentStep];
        // Short delay to ensure DOM is ready
        setTimeout(() => {
            const element = document.querySelector(step.target);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }, [isActive, currentPage, currentStep]);

    // Update highlight position
    useEffect(() => {
        if (!isActive || !currentPage) {
            setTargetRect(null);
            return;
        }

        const steps = tutorialSteps[currentPage];
        if (!steps || currentStep >= steps.length) {
            setTargetRect(null);
            return;
        }

        const updatePosition = () => {
            const step = steps[currentStep];
            const element = document.querySelector(step.target);

            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect(rect);
            }
        };

        // Initial position
        updatePosition();

        // Update position on scroll and resize
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isActive, currentPage, currentStep]);

    if (!isActive || !targetRect) {
        return null;
    }

    // Add padding around the highlighted element
    const padding = 8;
    const highlightStyle = {
        position: 'fixed' as const,
        top: targetRect.top - padding,
        left: targetRect.left - padding,
        width: targetRect.width + padding * 2,
        height: targetRect.height + padding * 2,
        pointerEvents: 'none' as const,
        zIndex: 9998,
    };

    return (
        <>
            {/* Dark overlay with cutout */}
            <div
                className="fixed inset-0 bg-black/60 transition-opacity duration-300"
                style={{
                    zIndex: 9997,
                    pointerEvents: 'auto',
                }}
            />

            {/* Highlighted area */}
            <div
                style={highlightStyle}
                className="rounded-lg ring-4 ring-primary ring-offset-2 ring-offset-background shadow-2xl transition-all duration-300"
            />
        </>
    );
}
