import { useState } from "react"
import { Consultant, SOLUTION_PLAYS } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface HoursSubmissionFormProps {
  open: boolean
  onClose: () => void
  consultants: Consultant[]
}

const SOLUTION_AREAS = [
  "AI Business Solutions",
  "Cloud & AI Platforms",
  "Security"
] as const

const SOLUTION_AREA_PLAYS: Record<string, string[]> = {
  "AI Business Solutions": [
    "Migrate & Modernize Apps",
    "Data Platform Modernization",
    "AI Adoption Pilot",
    "Copilot Readiness",
    "Zero Trust Implementation",
    "Defend Against Threats",
    "Cloud Infrastructure Foundation",
    "Teams Phone Enablement"
  ],
  "Cloud & AI Platforms": [
    "Migrate & Modernize Apps",
    "Data Platform Modernization",
    "AI Adoption Pilot",
    "Cloud Infrastructure Foundation"
  ],
  "Security": [
    "Zero Trust Implementation",
    "Defend Against Threats",
    "Copilot Readiness"
  ]
}

type HoursRange = "0-100" | "101-500" | "501+"

export function HoursSubmissionForm({ open, onClose, consultants }: HoursSubmissionFormProps) {
  const [teamMemberName, setTeamMemberName] = useState("")
  const [solutionArea, setSolutionArea] = useState<string>("")
  const [solutionPlay, setSolutionPlay] = useState<string>("")
  const [hoursRange, setHoursRange] = useState<HoursRange | "">("")
  const [actualHours, setActualHours] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!teamMemberName || !solutionArea || !solutionPlay || !hoursRange) {
      toast.error("Please fill in all required fields")
      return
    }

    toast.success("Hours submission recorded successfully")
    
    setTeamMemberName("")
    setSolutionArea("")
    setSolutionPlay("")
    setHoursRange("")
    setActualHours("")
    setAdditionalNotes("")
    onClose()
  }

  const availablePlays = solutionArea ? SOLUTION_AREA_PLAYS[solutionArea] || [] : []

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Solution Area & Solution Play Hours Submission</DialogTitle>
          <DialogDescription className="text-base">
            Please complete this form to report your assigned Solution Area, implemented Solution Plays, and billed hours for each play. Select the hours range based on your total hours worked.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="team-member-name" className="text-base">
              1. Team Member Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="team-member-name"
              placeholder="Enter your answer"
              value={teamMemberName}
              onChange={(e) => setTeamMemberName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base">
              2. Solution Area (prepopulated with Qualifier #2) <span className="text-destructive">*</span>
            </Label>
            <p className="text-sm text-muted-foreground">
              Select your assigned solution area for FY26.
            </p>
            <RadioGroup value={solutionArea} onValueChange={setSolutionArea}>
              {SOLUTION_AREAS.map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <RadioGroupItem value={area} id={`area-${area}`} />
                  <Label htmlFor={`area-${area}`} className="font-normal cursor-pointer">
                    {area}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base">
              3. Solution Play <span className="text-destructive">*</span>
            </Label>
            <RadioGroup 
              value={solutionPlay} 
              onValueChange={setSolutionPlay}
              disabled={!solutionArea}
            >
              {availablePlays.length > 0 ? (
                availablePlays.map((play) => (
                  <div key={play} className="flex items-center space-x-2">
                    <RadioGroupItem value={play} id={`play-${play}`} />
                    <Label htmlFor={`play-${play}`} className="font-normal cursor-pointer">
                      {play}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Please select a solution area first
                </p>
              )}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base">
              4. Hours Delivered (Range) <span className="text-destructive">*</span>
            </Label>
            <RadioGroup value={hoursRange} onValueChange={(value) => setHoursRange(value as HoursRange)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0-100" id="range-1" />
                <Label htmlFor="range-1" className="font-normal cursor-pointer">
                  0-100 (Apprentice)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="101-500" id="range-2" />
                <Label htmlFor="range-2" className="font-normal cursor-pointer">
                  101-500 (Contributor)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="501+" id="range-3" />
                <Label htmlFor="range-3" className="font-normal cursor-pointer">
                  +501 (Leader)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="actual-hours" className="text-base">
              5. Actual Hours (Optional)
            </Label>
            <p className="text-sm text-muted-foreground">
              Enter the exact number of hours delivered (optional).
            </p>
            <Input
              id="actual-hours"
              type="number"
              placeholder="Enter your answer"
              value={actualHours}
              onChange={(e) => setActualHours(e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional-notes" className="text-base">
              6. Additional Notes (Optional)
            </Label>
            <Textarea
              id="additional-notes"
              placeholder="Enter your answer"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
