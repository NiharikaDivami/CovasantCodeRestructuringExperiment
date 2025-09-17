import { useState, useEffect } from "react";
import { Loader2, CheckCircle, Sparkles } from "lucide-react";
import { AgentLoaderViewProps, FloatingParticleProps } from "./types";
import { loadingSteps } from "./constants";
import "./styles.css";

// Floating particle component
const FloatingParticle = ({ delay = 0 }: FloatingParticleProps) => (
  <div 
    className="floating-particle"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}ms`,
      animationDuration: `${2000 + Math.random() * 2000}ms`
    }}
  />
);

export default function AgentLoaderView({ selectedCERs, onComplete }: AgentLoaderViewProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    const processSteps = async () => {
      for (let i = 0; i < loadingSteps.length; i++) {
        const step = loadingSteps[i];
        setCurrentStepIndex(i);
        
        // Wait for the step duration
        await new Promise(resolve => setTimeout(resolve, step.duration));
        
        // Mark step as completed with a slight delay for animation
        setCompletedSteps(prev => new Set([...prev, step.id]));
        
        // Short pause after completion for visual effect
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Set completing state for final animation
      setIsCompleting(true);
      
      // Wait a moment before completing
      setTimeout(() => {
        onComplete();
      }, 1200);
    };

    processSteps();
  }, [onComplete]);

  const isStepActive = (index: number) => index === currentStepIndex && !completedSteps.has(loadingSteps[index].id);
  const isStepCompleted = (stepId: string) => completedSteps.has(stepId);
  const progress = ((completedSteps.size + (currentStepIndex < loadingSteps.length && !completedSteps.has(loadingSteps[currentStepIndex].id) ? 0.5 : 0)) / loadingSteps.length) * 100;

  return (
    <div className="agent-loader-container">
      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <FloatingParticle key={i} delay={i * 200} />
      ))}
      
      {/* Main content */}
      <div className="agent-loader-content">
        {/* Risk Pilot Logo/Header with breathing animation */}
        <div className="agent-loader-header">
          <div className={`agent-loader-logo ${isCompleting ? 'completing' : ''}`}>
            <div className={`agent-loader-logo-inner ${isCompleting ? 'completing' : ''}`}>
              <div className="agent-loader-logo-dot">
                {isCompleting && (
                  <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 animate-spin" />
                )}
              </div>
            </div>
          </div>
          <h1 className={`agent-loader-title ${isCompleting ? 'completing' : ''}`}>
            Risk Pilot AI Agent
          </h1>
          <p className="agent-loader-subtitle">
            Processing {selectedCERs.length} CER{selectedCERs.length !== 1 ? 's' : ''}
          </p>
          {isCompleting && (
            <div className="agent-loader-completion-badge">
              <div className="agent-loader-completion-badge-inner">
                <CheckCircle className="h-4 w-4 mr-2" />
                Processing Complete
              </div>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="agent-loader-steps">
          {loadingSteps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div 
                key={step.id} 
                className={`agent-loader-step ${
                  isStepCompleted(step.id) ? 'completed' : 
                  isStepActive(index) ? 'active' : 
                  'pending'
                }`}
              >
                <div className="agent-loader-step-icon">
                  {isStepCompleted(step.id) ? (
                    <div className="agent-loader-step-icon-container completed">
                      <CheckCircle className="h-6 w-6 text-green-600 animate-[bounce-once_0.6s_ease-out]" />
                    </div>
                  ) : isStepActive(index) ? (
                    <div className="agent-loader-step-icon-container active">
                      <StepIcon className="h-6 w-6 text-blue-600" />
                      <div className="agent-loader-step-icon-ping"></div>
                    </div>
                  ) : (
                    <div className="agent-loader-step-icon-container pending">
                      <StepIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="agent-loader-step-content">
                  <p className={`agent-loader-step-title ${
                    isStepCompleted(step.id) 
                      ? "completed" 
                      : isStepActive(index) 
                        ? "active" 
                        : "pending"
                  }`}>
                    {step.label}
                  </p>
                  <p className={`agent-loader-step-description ${
                    isStepCompleted(step.id) 
                      ? "completed" 
                      : isStepActive(index) 
                        ? "active" 
                        : "pending"
                  }`}>
                    {step.description}
                  </p>
                  {isStepActive(index) && (
                    <div className="agent-loader-step-status">
                      <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                      <div className="agent-loader-step-dots">
                        <div className="agent-loader-step-dot"></div>
                        <div className="agent-loader-step-dot"></div>
                        <div className="agent-loader-step-dot"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Progress Bar */}
        <div className="agent-loader-progress">
          <div className="agent-loader-progress-bar">
            <div 
              className={`agent-loader-progress-fill ${
                isCompleting ? 'completing' : 'active'
              }`}
              style={{ width: `${progress}%` }}
            >
              <div className="agent-loader-progress-fill-overlay"></div>
            </div>
          </div>
          <div className="agent-loader-progress-info">
            <p className={`agent-loader-progress-text ${
              isCompleting ? 'completing' : 'active'
            }`}>
              {Math.round(progress)}% complete
            </p>
            {progress === 100 && (
              <div className="agent-loader-progress-status">
                <Sparkles className="h-4 w-4 mr-1 animate-spin" />
                Finalizing...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success overlay */}
      {isCompleting && (
        <div className="agent-loader-success-overlay">
          <div className="agent-loader-success-icon">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>
      )}
    </div>
  );
}