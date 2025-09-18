export const CONFIDENCE_THRESHOLDS = {
  high: 85,
  medium: 60,
};

export const TOOLTIP_CONTENTS = {
  notStarted: {
    title: "Pending Analysis:",
    lines: [
      "• Awaiting AI agent processing",
      "• No confidence score available yet",
      "• Run agent to begin assessment",
      "• Evidence collection not started",
    ],
  },
  inProgress: {
    title: "Preliminary Assessment:",
    defaultFirstLine: "Partial evidence, missing docs",
    lines: [
      "• Analysis in progress",
      "• Score may change with additional evidence",
      "• Awaiting complete documentation",
    ],
  },
  finished: {
    title: "Analysis Complete",
    lines: [
      "• Based on evidence completeness and quality",
      "• AI assessment of control effectiveness",
      "• Validated against regulatory requirements",
      "• Analysis completed and verified",
      "• Final assessment available in detailed view",
    ],
  },
  repopulated: {
    title: "Analysis Updated",
    lines: [
      "• AI re-analyzed with additional evidence",
      "• Human insights and conclusions incorporated",
      "• Updated assessment with improved data",
      "• Enhanced accuracy and reliability",
      "• Latest analysis available in detailed view",
    ],
  },
} as const;
