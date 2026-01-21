import { Consultant } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"

interface CapabilitiesAssessmentProps {
  consultants: Consultant[]
}

export function CapabilitiesAssessment({ consultants }: CapabilitiesAssessmentProps) {
  const [teamMemberName, setTeamMemberName] = useState("")
  const [solutionArea, setSolutionArea] = useState("")

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-semibold">Capabilities Assessment</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Complete the assessment form below
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="team-member-name">
              Question 1: Team Member Name
            </Label>
            <Input
              id="team-member-name"
              placeholder="Enter team member name"
              value={teamMemberName}
              onChange={(e) => setTeamMemberName(e.target.value)}
            />
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
        </CardContent>
      </Card>
    </div>
  )
}
