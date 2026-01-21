import { Consultant, getSkillLevel, SOLUTION_PLAYS } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil, Trash, Briefcase, GlobeHemisphereWest } from "@phosphor-icons/react"
import { getSkillLevelColor } from "@/lib/types"

interface ConsultantCardProps {
  consultant: Consultant
  onEdit: (consultant: Consultant) => void
  onDelete: (id: string) => void
}

export function ConsultantCard({ consultant, onEdit, onDelete }: ConsultantCardProps) {
  const totalHours = Object.values(consultant.solutionPlays).reduce(
    (sum, data) => sum + data.hoursDelivered,
    0
  )

  const skillLevels = SOLUTION_PLAYS.map(play => ({
    play,
    hours: consultant.solutionPlays[play]?.hoursDelivered || 0,
    level: getSkillLevel(consultant.solutionPlays[play]?.hoursDelivered || 0)
  })).filter(s => s.level !== "Not Started")

  const leaderPlays = skillLevels.filter(s => s.level === "Leader")
  const contributorPlays = skillLevels.filter(s => s.level === "Contributor")
  const apprenticePlays = skillLevels.filter(s => s.level === "Apprentice")

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={consultant.avatar} alt={consultant.name} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {getInitials(consultant.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{consultant.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{consultant.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(consultant)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(consultant.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Hours Delivered</span>
            <span className="font-mono text-2xl font-bold text-primary">{totalHours}</span>
          </div>

          {consultant.region && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GlobeHemisphereWest className="h-4 w-4 text-muted-foreground" weight="duotone" />
                <span className="text-sm font-medium">Region</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {consultant.region}
              </Badge>
            </div>
          )}

          {consultant.industries && consultant.industries.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" weight="duotone" />
                <span className="text-sm font-medium">Industry Experience</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {consultant.industries.map(industry => (
                  <Badge key={industry} variant="outline" className="text-xs">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {skillLevels.length > 0 ? (
            <div className="space-y-3">
              {leaderPlays.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getSkillLevelColor("Leader")}>Leader</Badge>
                    <span className="text-xs text-muted-foreground">({leaderPlays.length})</span>
                  </div>
                  <div className="text-xs text-muted-foreground pl-1 space-y-1">
                    {leaderPlays.slice(0, 2).map(({ play, hours }) => (
                      <div key={play}>• {play} <span className="font-mono">({hours}h)</span></div>
                    ))}
                    {leaderPlays.length > 2 && (
                      <div className="italic">+ {leaderPlays.length - 2} more</div>
                    )}
                  </div>
                </div>
              )}
              
              {contributorPlays.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getSkillLevelColor("Contributor")}>Contributor</Badge>
                    <span className="text-xs text-muted-foreground">({contributorPlays.length})</span>
                  </div>
                  <div className="text-xs text-muted-foreground pl-1 space-y-1">
                    {contributorPlays.slice(0, 2).map(({ play, hours }) => (
                      <div key={play}>• {play} <span className="font-mono">({hours}h)</span></div>
                    ))}
                    {contributorPlays.length > 2 && (
                      <div className="italic">+ {contributorPlays.length - 2} more</div>
                    )}
                  </div>
                </div>
              )}
              
              {apprenticePlays.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getSkillLevelColor("Apprentice")}>Apprentice</Badge>
                    <span className="text-xs text-muted-foreground">({apprenticePlays.length})</span>
                  </div>
                  <div className="text-xs text-muted-foreground pl-1 space-y-1">
                    {apprenticePlays.slice(0, 2).map(({ play, hours }) => (
                      <div key={play}>• {play} <span className="font-mono">({hours}h)</span></div>
                    ))}
                    {apprenticePlays.length > 2 && (
                      <div className="italic">+ {apprenticePlays.length - 2} more</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">
              No solution plays started
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
