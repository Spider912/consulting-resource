import { Consultant, getSkillLevel, SOLUTION_PLAYS } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil, Trash } from "@phosphor-icons/react"
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
    level: getSkillLevel(consultant.solutionPlays[play]?.hoursDelivered || 0)
  })).filter(s => s.level !== "Not Started")

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
          
          <div>
            <p className="text-sm font-medium mb-2">Active Solution Plays</p>
            <div className="flex flex-wrap gap-2">
              {skillLevels.length > 0 ? (
                skillLevels.slice(0, 5).map(({ play, level }) => (
                  <Badge
                    key={play}
                    className={getSkillLevelColor(level)}
                  >
                    {level}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No solution plays started</span>
              )}
              {skillLevels.length > 5 && (
                <Badge variant="outline">+{skillLevels.length - 5} more</Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
