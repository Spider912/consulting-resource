import { Consultant, SOLUTION_PLAYS, getSkillLevel, SkillLevel } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Target, TrendUp, Users, Plus } from "@phosphor-icons/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HoursSubmissionForm } from "./HoursSubmissionForm"

interface CapabilitiesAssessmentProps {
  consultants: Consultant[]
}

interface CapabilityGap {
  solutionPlay: string
  leaders: number
  contributors: number
  apprentices: number
  total: number
  coverage: number
}

export function CapabilitiesAssessment({ consultants }: CapabilitiesAssessmentProps) {
  const [selectedPlay, setSelectedPlay] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getSkillLevelColor = (level: SkillLevel): string => {
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

  const capabilityGaps: CapabilityGap[] = SOLUTION_PLAYS.map(play => {
    const consultantsWithPlay = consultants.map(consultant => {
      const hours = consultant.solutionPlays[play]?.hoursDelivered || 0
      return {
        consultant,
        level: getSkillLevel(hours),
        hours
      }
    })

    const leaders = consultantsWithPlay.filter(c => c.level === "Leader").length
    const contributors = consultantsWithPlay.filter(c => c.level === "Contributor").length
    const apprentices = consultantsWithPlay.filter(c => c.level === "Apprentice").length
    const total = leaders + contributors + apprentices
    const coverage = consultants.length > 0 ? (total / consultants.length) * 100 : 0

    return {
      solutionPlay: play,
      leaders,
      contributors,
      apprentices,
      total,
      coverage
    }
  }).sort((a, b) => b.coverage - a.coverage)

  const topCapabilities = capabilityGaps.filter(gap => gap.coverage >= 50).slice(0, 5)
  const gapCapabilities = capabilityGaps.filter(gap => gap.coverage < 50 && gap.total > 0)
  const missingCapabilities = capabilityGaps.filter(gap => gap.total === 0)

  const filteredConsultants = selectedPlay === "all" 
    ? consultants 
    : consultants.filter(c => {
        const hours = c.solutionPlays[selectedPlay]?.hoursDelivered || 0
        return hours > 0
      })

  const getConsultantsByPlayAndLevel = (play: string, level: SkillLevel) => {
    return consultants.filter(c => {
      const hours = c.solutionPlays[play]?.hoursDelivered || 0
      return getSkillLevel(hours) === level
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Capabilities Assessment</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Track team capabilities and submit solution play hours
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Submit Hours
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Target className="h-4 w-4 text-emerald-600" weight="duotone" />
              </div>
              Strong Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{topCapabilities.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Solution plays with 50%+ coverage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <TrendUp className="h-4 w-4 text-amber-600" weight="duotone" />
              </div>
              Growing Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{gapCapabilities.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Solution plays with under 50% coverage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Users className="h-4 w-4 text-red-600" weight="duotone" />
              </div>
              Missing Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{missingCapabilities.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Solution plays with no consultants
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Capability Coverage</CardTitle>
            <CardDescription>
              Team coverage across all solution plays
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {capabilityGaps.slice(0, 10).map(gap => (
              <div key={gap.solutionPlay} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{gap.solutionPlay}</span>
                  <span className="text-sm text-muted-foreground">
                    {gap.total} / {consultants.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500"
                      style={{ width: `${gap.coverage}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground w-12 text-right">
                    {gap.coverage.toFixed(0)}%
                  </span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="text-emerald-600 font-medium">{gap.leaders} Leaders</span>
                  <span className="text-blue-600 font-medium">{gap.contributors} Contributors</span>
                  <span className="text-amber-600 font-medium">{gap.apprentices} Apprentices</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capability Deep Dive</CardTitle>
            <CardDescription>
              View consultants by solution play and skill level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedPlay} onValueChange={setSelectedPlay}>
              <SelectTrigger>
                <SelectValue placeholder="Select a solution play" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Solution Plays</SelectItem>
                {SOLUTION_PLAYS.map(play => (
                  <SelectItem key={play} value={play}>
                    {play}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedPlay !== "all" ? (
              <div className="space-y-4">
                {(["Leader", "Contributor", "Apprentice"] as SkillLevel[]).map(level => {
                  const consultantsAtLevel = getConsultantsByPlayAndLevel(selectedPlay, level)
                  if (consultantsAtLevel.length === 0) return null

                  return (
                    <div key={level}>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getSkillLevelColor(level)}>{level}</Badge>
                        <span className="text-xs text-muted-foreground">
                          ({consultantsAtLevel.length})
                        </span>
                      </div>
                      <div className="space-y-2 pl-2">
                        {consultantsAtLevel.map(consultant => {
                          const hours = consultant.solutionPlays[selectedPlay]?.hoursDelivered || 0
                          return (
                            <div key={consultant.id} className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={consultant.avatar} alt={consultant.name} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                  {getInitials(consultant.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="text-sm font-medium">{consultant.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {hours} hours delivered
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredConsultants.slice(0, 8).map(consultant => {
                  const totalHours = Object.values(consultant.solutionPlays).reduce(
                    (sum, data) => sum + data.hoursDelivered,
                    0
                  )
                  const activePlays = SOLUTION_PLAYS.filter(play => {
                    const hours = consultant.solutionPlays[play]?.hoursDelivered || 0
                    return hours > 0
                  }).length

                  return (
                    <div key={consultant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={consultant.avatar} alt={consultant.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {getInitials(consultant.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{consultant.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {activePlays} active plays • {totalHours} total hours
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {missingCapabilities.length > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="text-red-900">Missing Capabilities</CardTitle>
            <CardDescription className="text-red-700">
              These solution plays have no consultants with any experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {missingCapabilities.map(gap => (
                <Badge key={gap.solutionPlay} variant="outline" className="border-red-300 text-red-800">
                  {gap.solutionPlay}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <HoursSubmissionForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        consultants={consultants}
      />
    </div>
  )
}
