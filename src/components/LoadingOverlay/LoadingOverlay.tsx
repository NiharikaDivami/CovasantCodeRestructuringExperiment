import { Loader2 } from "lucide-react";
import type { LoadingOverlayProps } from "./types";
import { DEFAULT_LOADING_MESSAGE } from "./constants";
import "./styles.css";

export default function LoadingOverlay({ 
  isVisible, 
  message = DEFAULT_LOADING_MESSAGE 
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <Loader2 className="loading-spinner" />
        <span className="loading-message">{message}</span>
      </div>
    </div>
  );
}
