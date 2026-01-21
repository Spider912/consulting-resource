import { Consultant, getSkillLevel } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, GraduationCap, Trophy, Presentation, Article, Certificate, Database } from "@phosphor-icons/react"

interface OverviewMetricsProps {
  consultants: Consultant[]
}

export function OverviewMetrics({ consultants }: OverviewMetricsProps) {
  const totalConsultants = consultants.length
  
  const totalHours = consultants.reduce((sum, consultant) => {
    return sum + Object.values(consultant.solutionPlays).reduce(
      (playSum, data) => playSum + data.hoursDelivered,
      0
    )
  }, 0)

  const totalTraining = consultants.reduce((sum, consultant) => {
    return sum + Object.values(consultant.solutionPlays).reduce(
      (playSum, data) => playSum + data.trainingCompleted,
      0
    )
  }, 0)

  const totalPreSalesHours = 527

  const totalArticles = 7

  const totalCertifications = 27

  const leaderConsultants = consultants.filter(consultant => {
    return Object.values(consultant.solutionPlays).some(
      data => getSkillLevel(data.hoursDelivered) === "Leader"
    )
  }).length

  const metrics = [
    {
      title: "Total Consultants",
      value: totalConsultants > 1 ? totalConsultants : 1,
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "Total Hours Delivered",
      value: totalHours > 1 ? totalHours.toLocaleString() : 1,
      icon: Clock,
      color: "text-accent"
    },
    {
      title: "Pre-Sales Hours",
      value: totalPreSalesHours.toLocaleString(),
      icon: Presentation,
      color: "text-purple-500"
    },
    {
      title: "Articles Posted",
      value: totalArticles.toLocaleString(),
      icon: Article,
      color: "text-orange-500"
    },
    {
      title: "Certifications",
      value: totalCertifications.toLocaleString(),
      icon: Certificate,
      color: "text-cyan-500"
    },
    {
      title: "Training Hours Completed",
      value: totalTraining > 1 ? totalTraining.toLocaleString() : 1,
      icon: GraduationCap,
      color: "text-primary"
    },
    {
      title: "Leader Level Consultants",
      value: leaderConsultants > 1 ? leaderConsultants : 1,
      icon: Trophy,
      color: "text-emerald-500"
    },
    {
      title: "Future Data Source",
      value: "—",
      icon: Database,
      color: "text-slate-500"
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <Card key={metric.title} className="hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-2 pt-5 px-5">
              <div className="flex items-center justify-between">
                <Icon className={`h-6 w-6 ${metric.color}`} weight="duotone" />
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className={`font-mono text-3xl font-bold ${metric.color} mb-2`}>
                {metric.value}
              </div>
              <CardTitle className="text-sm font-medium text-muted-foreground leading-tight">
                {metric.title}
              </CardTitle>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
