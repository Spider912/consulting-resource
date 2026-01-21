import { Consultant, SOLUTION_PLAYS, SkillLevel } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useEffect, useMemo } from "react"

interface CapabilitiesAssessmentProps {
  consultants: Consultant[]
}

export function CapabilitiesAssessment({ consultants }: CapabilitiesAssessmentProps) {
  const [teamMemberName, setTeamMemberName] = useState("")
  const [solutionArea, setSolutionArea] = useState("")
  const [expertiseLevels, setExpertiseLevels] = useState<Record<string, SkillLevel>>({})

  useEffect(() => {
    if (consultants.length > 0 && !teamMemberName) {
      setTeamMemberName(consultants[0].name)
    }
  }, [consultants, teamMemberName])

  const selectedConsultant = useMemo(() => {
    return consultants.find(c => c.name === teamMemberName)
  }, [consultants, teamMemberName])

  useEffect(() => {
    if (selectedConsultant) {
      const initialLevels: Record<string, SkillLevel> = {}
      SOLUTION_PLAYS.forEach(play => {
        const deliveredHours = selectedConsultant.solutionPlays[play]?.hoursDelivered || 0
        if (deliveredHours >= 500) {
          initialLevels[play] = "Leader"
        } else if (deliveredHours >= 200) {
          initialLevels[play] = "Contributor"
        } else {
          initialLevels[play] = "Apprentice"
        }
      })
      setExpertiseLevels(initialLevels)
    }
  }, [selectedConsultant])

  const handleExpertiseChange = (solutionPlay: string, level: SkillLevel) => {
    setExpertiseLevels(prev => ({
      ...prev,
      [solutionPlay]: level
    }))
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-semibold">Capabilities Assessment</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Complete the assessment form below
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Form</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Please review your Capabilities Profile and adjust your expertise level accordingly as needed.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="team-member-name">
              Question 1: Team Member Name
            </Label>
            <Select value={teamMemberName} onValueChange={setTeamMemberName}>
              <SelectTrigger id="team-member-name">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {consultants.map((consultant) => (
                  <SelectItem key={consultant.id} value={consultant.name}>
                    {consultant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>
              Question 2: Solution Area (based on Qualifier 2)
            </Label>
            <RadioGroup value={solutionArea} onValueChange={setSolutionArea}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ai-business-solutions" id="ai-business-solutions" />
                <Label htmlFor="ai-business-solutions" className="font-normal cursor-pointer">
                  AI Business Solutions
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cloud-ai-platform" id="cloud-ai-platform" />
                <Label htmlFor="cloud-ai-platform" className="font-normal cursor-pointer">
                  Cloud and AI Platform
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="security" id="security" />
                <Label htmlFor="security" className="font-normal cursor-pointer">
                  Security
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>
              Question 3: Expertise by Solution Play
            </Label>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[45%]">Solution Play</TableHead>
                    <TableHead className="w-[25%]">Delivered Hours</TableHead>
                    <TableHead className="w-[30%]">Expertise Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SOLUTION_PLAYS.map((play) => {
                    const deliveredHours = selectedConsultant?.solutionPlays[play]?.hoursDelivered || 0
                    return (
                      <TableRow key={play}>
                        <TableCell className="font-medium text-sm">{play}</TableCell>
                        <TableCell className="text-sm font-mono">{deliveredHours}</TableCell>
                        <TableCell>
                          <Select
                            value={expertiseLevels[play] || "Apprentice"}
                            onValueChange={(value) => handleExpertiseChange(play, value as SkillLevel)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Apprentice">Apprentice</SelectItem>
                              <SelectItem value="Contributor">Contributor</SelectItem>
                              <SelectItem value="Leader">Leader</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
