import { Bot, User, Clock } from "lucide-react";

export const getActivityIcon = (type: string) => {
  switch (type) {
    case "ai-populated":
      return Bot;
    case "human-insight":
      return User;
    case "repopulated":
      return Bot;
    default:
      return Clock;
  }
};

export const getActivityIconColor = (type: string): string => {
  switch (type) {
    case "ai-populated":
      return "text-blue-500";
    case "human-insight":
      return "text-green-500";
    case "repopulated":
      return "text-purple-500";
    default:
      return "text-gray-400";
  }
};