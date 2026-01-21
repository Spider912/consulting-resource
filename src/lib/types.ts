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

export const INDUSTRIES = [
  "Banking",
  "Manufacturing",
  "Retail",
  "Insurance",
  "Professional Services",
  "Government",
  "Healthcare",
  "Education",
  "Defense"
] as const

export const REGIONS = [
  "Americas",
  "EMEA",
  "Asia"
] as const

export type SolutionPlay = typeof SOLUTION_PLAYS[number]
export type Industry = typeof INDUSTRIES[number]
export type Region = typeof REGIONS[number]

export type SkillLevel = "Apprentice" | "Contributor" | "Leader" | "Not Started"

export interface SolutionPlayData {
  trainingCompleted: number
  hoursDelivered: number
  preSalesHours: number
  articlesPosted: number
  certifications: number
}

export interface Consultant {
  id: string
  name: string
  email: string
  avatar?: string
  industries?: Industry[]
  primaryIndustry?: Industry
  region?: Region
  solutionPlays: Record<string, SolutionPlayData>
}

export function getSkillLevel(hours: number): SkillLevel {
  if (hours === 0) return "Not Started"
  if (hours < 200) return "Apprentice"
  if (hours < 500) return "Contributor"
  return "Leader"
}

export function getSkillLevelColor(level: SkillLevel): string {
  switch (level) {
    case "Leader":
      return "bg-emerald-500 text-white"
    case "Contributor":
      return "bg-blue-500 text-white"
    case "Apprentice":
      return "bg-amber-500 text-white"
    default:
      return "bg-gray-300 text-gray-600"
  }
}
