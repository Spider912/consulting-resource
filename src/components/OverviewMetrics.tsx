import { Consultant, getSkillLevel } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, GraduationCap, Trophy, Presentation, Article, Certificate } from "@phosphor-icons/react"

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

  const totalPreSalesHours = consultants.reduce((sum, consultant) => {
    return sum + Object.values(consultant.solutionPlays).reduce(
      (playSum, data) => playSum + (data.preSalesHours || 0),
      0
    )
  }, 0)

  const totalArticles = consultants.reduce((sum, consultant) => {
    return sum + Object.values(consultant.solutionPlays).reduce(
      (playSum, data) => playSum + (data.articlesPosted || 0),
      0
    )
  }, 0)

  const totalCertifications = consultants.reduce((sum, consultant) => {
    return sum + Object.values(consultant.solutionPlays).reduce(
      (playSum, data) => playSum + (data.certifications || 0),
      0
    )
  }, 0)

  const leaderConsultants = consultants.filter(consultant => {
    return Object.values(consultant.solutionPlays).some(
      data => getSkillLevel(data.hoursDelivered) === "Leader"
    )
  }).length

  const metrics = [
    {
      title: "Total Consultants",
      value: totalConsultants,
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "Total Hours Delivered",
      value: totalHours.toLocaleString(),
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
      title: "Training Completed",
      value: totalTraining.toLocaleString(),
      icon: GraduationCap,
      color: "text-primary"
    },
    {
      title: "Leader Level Consultants",
      value: leaderConsultants,
      icon: Trophy,
      color: "text-emerald-500"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <Card key={metric.title} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${metric.color}`} weight="duotone" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`font-mono text-3xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
