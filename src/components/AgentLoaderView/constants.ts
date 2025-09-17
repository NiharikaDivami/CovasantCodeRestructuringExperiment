import { FileText, Brain } from "lucide-react";
import type { LoadingStep } from "./types";

export const loadingSteps: LoadingStep[] = [
  { 
    id: "scripts", 
    label: "Analysed test scripts", 
    description: "Processing and evaluating test scenarios",
    icon: FileText,
    duration: 3000 
  },
  { 
    id: "analysis", 
    label: "AI analysis completed", 
    description: "Finalizing insights and recommendations",
    icon: Brain,
    duration: 2500 
  },
];