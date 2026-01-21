export const SOLUTION_PLAYS = [
  "Migrate and Modernize your Estate",
  "Innovate with Azure",
  "AI Apps and Agents",
  "Secure AI Productivity",
  "Unify Your Data Platform",
  "Modern SecOps with Unified Platform",
  "Data Security",
  "Protect Cloud AI Platform and Apps",
  "Copilot and Agents at Work",
  "Converged Communications",
  "Scale with Cloud and AI Endpoints",
  "AI Ready with Surface Copilot PCs",
  "Innovate with Low Code AI and Agents",
  "Sales Transformation with AI",
  "Service Transformation with AI",
  "ERP Transformation with AI",
  "Scale Business Operations with AI"
] as const

export type SolutionPlay = typeof SOLUTION_PLAYS[number]

export type SkillLevel = "Beginner" | "Collaborator" | "Lead" | "Not Started"

export interface SolutionPlayData {
  trainingCompleted: number
  hoursDelivered: number
}

export interface Consultant {
  id: string
  name: string
  email: string
  avatar?: string
  solutionPlays: Record<string, SolutionPlayData>
}

export function getSkillLevel(hours: number): SkillLevel {
  if (hours === 0) return "Not Started"
  if (hours < 200) return "Beginner"
  if (hours < 500) return "Collaborator"
  return "Lead"
}

export function getSkillLevelColor(level: SkillLevel): string {
  switch (level) {
    case "Lead":
      return "bg-emerald-500 text-white"
    case "Collaborator":
      return "bg-blue-500 text-white"
    case "Beginner":
      return "bg-amber-500 text-white"
    default:
      return "bg-gray-300 text-gray-600"
  }
}
