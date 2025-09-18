import type { VendorCERMapEntry } from "./types";

export const vendorCERMapping: VendorCERMapEntry[] = [
  { cerId: "CER-10234", vendor: "Amazon Web Services", analyst: "Jacob Corman", testScriptCount: 6, riskLevel: "Critical" },
  { cerId: "CER-10567", vendor: "Microsoft Azure", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Critical" },
  { cerId: "CER-10892", vendor: "Google Cloud Platform", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Medium" },
  { cerId: "CER-10901", vendor: "Adobe Systems", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Low" },
  { cerId: "CER-10923", vendor: "Atlassian Corp", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Medium" },
  { cerId: "CER-10956", vendor: "Zoom Video", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Low" },
  { cerId: "CER-11001", vendor: "Oracle Corporation", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Critical" },
  { cerId: "CER-11089", vendor: "Slack Technologies", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Medium" },
  { cerId: "CER-11156", vendor: "Box Inc", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Critical" },
  { cerId: "CER-11203", vendor: "HubSpot Inc", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Low" },
  { cerId: "CER-11278", vendor: "Dropbox Inc", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Medium" },
  { cerId: "CER-11324", vendor: "Zendesk Inc", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Critical" },
  { cerId: "CER-11567", vendor: "IBM Cloud", analyst: "Emily Rodriguez", testScriptCount: 2, riskLevel: "Medium" },
  { cerId: "CER-11892", vendor: "Snowflake Inc", analyst: "Emily Rodriguez", testScriptCount: 2, riskLevel: "High" },
  { cerId: "CER-12001", vendor: "ServiceNow", analyst: "Emily Rodriguez", testScriptCount: 2, riskLevel: "Medium" },
  { cerId: "CER-12234", vendor: "SAP SE", analyst: "Sarah Williams", testScriptCount: 2, riskLevel: "Low" },
  { cerId: "CER-12567", vendor: "Workday Inc", analyst: "Sarah Williams", testScriptCount: 2, riskLevel: "Medium" },
  { cerId: "CER-13001", vendor: "MongoDB Inc", analyst: "Daniel Kim", testScriptCount: 3, riskLevel: "Medium" },
  { cerId: "CER-13234", vendor: "Databricks Inc", analyst: "Alex Chen", testScriptCount: 2, riskLevel: "High" },
  { cerId: "CER-13567", vendor: "Twilio Inc", analyst: "Maria Gonzalez", testScriptCount: 2, riskLevel: "Medium" }
];
