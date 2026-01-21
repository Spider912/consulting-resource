import { Consultant, SOLUTION_PLAYS, getSkillLevel, getSkillLevelColor } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SkillsMatrixProps {
  consultants: Consultant[]
}

export function SkillsMatrix({ consultants }: SkillsMatrixProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills Matrix</CardTitle>
        <p className="text-sm text-muted-foreground">
          Comprehensive view of team capabilities across all solution plays
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="min-w-max">
            <div className="grid gap-2">
              <div className="grid grid-cols-[200px_repeat(17,140px)] gap-2 pb-2 border-b-2 sticky top-0 bg-card z-10">
                <div className="font-semibold text-sm px-3 py-2">Consultant</div>
                {SOLUTION_PLAYS.map((play) => (
                  <div
                    key={play}
                    className="font-semibold text-xs px-2 py-2 text-center"
                    title={play}
                  >
                    <div className="line-clamp-2">{play}</div>
                  </div>
                ))}
              </div>

              {consultants.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No consultants added yet. Add your first consultant to see the skills matrix.
                </div>
              ) : (
                <TooltipProvider>
                  {consultants.map((consultant) => (
                    <div
                      key={consultant.id}
                      className="grid grid-cols-[200px_repeat(17,140px)] gap-2 py-2 hover:bg-muted/50 rounded-md transition-colors"
                    >
                      <div className="px-3 py-2 font-medium text-sm truncate" title={consultant.name}>
                        {consultant.name}
                      </div>
                      {SOLUTION_PLAYS.map((play) => {
                        const data = consultant.solutionPlays[play]
                        const hours = data?.hoursDelivered || 0
                        const training = data?.trainingCompleted || 0
                        const level = getSkillLevel(hours)

                        return (
                          <Tooltip key={play}>
                            <TooltipTrigger asChild>
                              <div className="flex items-center justify-center px-2 py-1">
                                <Badge
                                  className={`${getSkillLevelColor(level)} text-xs px-2 py-1 w-full justify-center`}
                                  variant={level === "Not Started" ? "outline" : "default"}
                                >
                                  {level === "Not Started" ? "—" : level.charAt(0)}
                                </Badge>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-xs space-y-1">
                                <div className="font-semibold">{play}</div>
                                <div>Level: {level}</div>
                                <div>Training: {training}</div>
                                <div>Hours: {hours}</div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )
                      })}
                    </div>
                  ))}
                </TooltipProvider>
              )}
            </div>
          </div>
        </ScrollArea>
        
        <div className="mt-6 pt-4 border-t flex items-center gap-6 text-sm">
          <span className="font-medium">Legend:</span>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500 text-white">L</Badge>
            <span className="text-muted-foreground">Lead (500+ hrs)</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500 text-white">C</Badge>
            <span className="text-muted-foreground">Collaborator (200-500 hrs)</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500 text-white">B</Badge>
            <span className="text-muted-foreground">Beginner (&lt;200 hrs)</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">—</Badge>
            <span className="text-muted-foreground">Not Started</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
