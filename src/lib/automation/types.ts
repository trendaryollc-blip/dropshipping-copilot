export type AutomationModuleId =
  | "product-research"
  | "suppliers"
  | "copywriting"
  | "orders"
  | "full-pipeline";

export type JobStatus = "idle" | "running" | "completed" | "failed";

export interface AutomationStep {
  id: string;
  label: string;
  status: JobStatus;
  detail?: string;
}

export interface AutomationJobResult {
  moduleId: AutomationModuleId;
  status: JobStatus;
  startedAt: string;
  completedAt: string;
  steps: AutomationStep[];
  output: Record<string, unknown>;
  message: string;
}

export interface ModuleDefinition {
  id: AutomationModuleId;
  name: string;
  description: string;
  href: string;
  icon: string;
  capabilities: string[];
}
