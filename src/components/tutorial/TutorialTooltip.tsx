import { useEffect, useState } from 'react';
import { useTutorial } from '@/contexts/TutorialContext';
import { tutorialSteps } from '@/data/tutorialSteps';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export function TutorialTooltip() {
    const { isActive, currentPage, currentStep, nextStep, prevStep, skipTutorial, completeTutorial } = useTutorial();
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [placement, setPlacement] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');

    useEffect(() => {
        if (!isActive || !currentPage) return;

        const steps = tutorialSteps[currentPage];
        if (!steps || currentStep >= steps.length) return;

        const step = steps[currentStep];
        const element = document.querySelector(step.target);

        if (element) {
            const rect = element.getBoundingClientRect();
            const tooltipWidth = 320;
            const tooltipHeight = 200;
            const gap = 16;

            let top = 0;
            let left = 0;
            let finalPlacement = step.placement || 'bottom';

            // Calculate position based on placement
            switch (finalPlacement) {
                case 'bottom':
                    top = rect.bottom + gap;
                    left = rect.left + rect.width / 2 - tooltipWidth / 2;
                    // Check if it fits
                    if (top + tooltipHeight > window.innerHeight) {
                        finalPlacement = 'top';
                        top = rect.top - tooltipHeight - gap;
                    }
                    break;
                case 'top':
                    top = rect.top - tooltipHeight - gap;
                    left = rect.left + rect.width / 2 - tooltipWidth / 2;
                    if (top < 0) {
                        finalPlacement = 'bottom';
                        top = rect.bottom + gap;
                    }
                    break;
                case 'right':
                    top = rect.top + rect.height / 2 - tooltipHeight / 2;
                    left = rect.right + gap;
                    if (left + tooltipWidth > window.innerWidth) {
                        finalPlacement = 'left';
                        left = rect.left - tooltipWidth - gap;
                    }
                    break;
                case 'left':
                    top = rect.top + rect.height / 2 - tooltipHeight / 2;
                    left = rect.left - tooltipWidth - gap;
                    if (left < 0) {
                        finalPlacement = 'right';
                        left = rect.right + gap;
                    }
                    break;
            }

            // Keep tooltip within viewport
            left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));
            top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16));

            setPosition({ top, left });
            setPlacement(finalPlacement);
        }
    }, [isActive, currentPage, currentStep]);

    if (!isActive || !currentPage) return null;

    const steps = tutorialSteps[currentPage];
    if (!steps || currentStep >= steps.length) return null;

    const step = steps[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            completeTutorial();
        } else {
            nextStep();
        }
    };

    return (
        <Card
            className="fixed w-80 shadow-2xl border-2 border-primary animate-in fade-in zoom-in-95 duration-300"
            style={{
                top: position.top,
                left: position.left,
                zIndex: 9999,
            }}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                            Paso {currentStep + 1} de {steps.length}
                        </CardDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 -mt-1 -mr-1"
                        onClick={skipTutorial}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{step.description}</p>

                <div className="flex items-center justify-between gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={prevStep}
                        disabled={isFirstStep}
                        className="flex-1"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Anterior
                    </Button>

                    <Button
                        size="sm"
                        onClick={handleNext}
                        className="flex-1"
                    >
                        {isLastStep ? 'Finalizar' : 'Siguiente'}
                        {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
                    </Button>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipTutorial}
                    className="w-full text-xs"
                >
                    Saltar Tutorial
                </Button>
            </CardContent>
        </Card>
    );
}
