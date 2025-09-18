import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileText, CheckCircle } from "lucide-react";
import type { VCMAnalysisModalProps, AnalysisData, RiskLevel } from "./types";
import { ANALYSIS_MAP } from "./constants";
import "./styles.css";

export default function RiskPilotAnalysisModal({ isOpen, onClose, cerId }: VCMAnalysisModalProps) {
  const getAnalysisData = (id: string): AnalysisData => ANALYSIS_MAP[id] || ANALYSIS_MAP["CER-10234"];

  const analysisData = getAnalysisData(cerId);

  const getRiskLevelColor = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case 'High':
        return "bg-red-100 text-red-800 border-red-200";
      case 'Medium':
        return "bg-amber-100 text-amber-800 border-amber-200";
      case 'Low':
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl text-gray-900">Risk Pilot Analysis</DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-2">Detailed AI analysis and reasoning for CER ID: {cerId}</DialogDescription>

          <div className="space-y-3 mt-4">
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-base px-3 py-1 border-2 border-blue-200 bg-blue-50 text-blue-800">
                CER ID: {cerId}
              </Badge>
            </div>

            <div className="flex items-center justify-end">
              <Badge className={`${getRiskLevelColor(analysisData.riskLevel)} text-sm px-3 py-1 border`}>
                Risk Level: {analysisData.riskLevel}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <FileText className="h-4 w-4" />
                <span>Source Documents Available</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysisData.sourceDocuments.map((doc, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
