import { useState } from "react"
import { Consultant, SOLUTION_PLAYS, getSkillLevel, getSkillLevelColor } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AnalyticsViewProps {
  consultants: Consultant[]
}

export function AnalyticsView({ consultants }: AnalyticsViewProps) {
  const [selectedPlay, setSelectedPlay] = useState<string>(SOLUTION_PLAYS[0])

  const getAnalytics = () => {
    const consultantsWithSkill = consultants
      .map(c => ({
        consultant: c,
        data: c.solutionPlays[selectedPlay] || { trainingCompleted: 0, hoursDelivered: 0 },
        level: getSkillLevel(c.solutionPlays[selectedPlay]?.hoursDelivered || 0)
      }))
      .filter(c => c.level !== "Not Started")
      .sort((a, b) => b.data.hoursDelivered - a.data.hoursDelivered)

    const totalHours = consultantsWithSkill.reduce((sum, c) => sum + c.data.hoursDelivered, 0)
    const totalTraining = consultantsWithSkill.reduce((sum, c) => sum + c.data.trainingCompleted, 0)

    const skillDistribution = {
      Leader: consultantsWithSkill.filter(c => c.level === "Leader").length,
      Contributor: consultantsWithSkill.filter(c => c.level === "Contributor").length,
      Apprentice: consultantsWithSkill.filter(c => c.level === "Apprentice").length,
    }

    return {
      consultantsWithSkill,
      totalHours,
      totalTraining,
      skillDistribution,
      totalConsultants: consultantsWithSkill.length,
    }
  }

  const analytics = getAnalytics()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Solution Play Analytics</CardTitle>
          <div className="pt-2">
            <Select value={selectedPlay} onValueChange={setSelectedPlay}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOLUTION_PLAYS.map(play => (
                  <SelectItem key={play} value={play}>
                    {play}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="text-sm text-muted-foreground">Total Consultants</div>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold text-primary">
              {analytics.totalConsultants}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="text-sm text-muted-foreground">Total Hours</div>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold text-primary">
              {analytics.totalHours}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="text-sm text-muted-foreground">Training Completed</div>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold text-primary">
              {analytics.totalTraining}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="text-sm text-muted-foreground">Leader Level</div>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold text-emerald-500">
              {analytics.skillDistribution.Leader}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leader Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500 mb-2">
              {analytics.skillDistribution.Leader}
            </div>
            <p className="text-sm text-muted-foreground">500+ hours delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contributor Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {analytics.skillDistribution.Contributor}
            </div>
            <p className="text-sm text-muted-foreground">200-500 hours delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Apprentice Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500 mb-2">
              {analytics.skillDistribution.Apprentice}
            </div>
            <p className="text-sm text-muted-foreground">&lt;200 hours delivered</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Qualified Consultants</CardTitle>
          <p className="text-sm text-muted-foreground">
            Consultants with experience in {selectedPlay}
          </p>
        </CardHeader>
        <CardContent>
          {analytics.consultantsWithSkill.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No consultants have started this solution play yet
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.consultantsWithSkill.map(({ consultant, data, level }) => (
                <div
                  key={consultant.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={consultant.avatar} alt={consultant.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials(consultant.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{consultant.name}</div>
                      <div className="text-sm text-muted-foreground">{consultant.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Training</div>
                      <div className="font-mono font-semibold">{data.trainingCompleted}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Hours</div>
                      <div className="font-mono font-semibold">{data.hoursDelivered}</div>
                    </div>
                    <Badge className={`${getSkillLevelColor(level)} ml-2`}>
                      {level}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
