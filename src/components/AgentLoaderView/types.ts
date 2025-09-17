export interface AgentLoaderViewProps {
  selectedCERs: string[];
  onComplete: () => void;
}

export interface LoadingStep {
  id: string;
  label: string;
  description: string;
  icon: any;
  duration: number; // in milliseconds
}

export interface FloatingParticleProps {
  delay?: number;
}