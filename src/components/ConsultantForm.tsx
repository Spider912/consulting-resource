import { useState, useEffect } from "react"
import { Consultant, SOLUTION_PLAYS, SolutionPlayData } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface ConsultantFormProps {
  open: boolean
  onClose: () => void
  onSave: (consultant: Consultant) => void
  consultant?: Consultant
}

export function ConsultantForm({ open, onClose, onSave, consultant }: ConsultantFormProps) {
  const [formData, setFormData] = useState<Consultant>({
    id: "",
    name: "",
    email: "",
    solutionPlays: {},
  })

  useEffect(() => {
    if (consultant) {
      setFormData(consultant)
    } else {
      setFormData({
        id: Date.now().toString(),
        name: "",
        email: "",
        solutionPlays: {},
      })
    }
  }, [consultant, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const updateSolutionPlay = (play: string, field: keyof SolutionPlayData, value: string) => {
    const numValue = parseInt(value) || 0
    setFormData(prev => ({
      ...prev,
      solutionPlays: {
        ...prev.solutionPlays,
        [play]: {
          trainingCompleted: prev.solutionPlays[play]?.trainingCompleted || 0,
          hoursDelivered: prev.solutionPlays[play]?.hoursDelivered || 0,
          [field]: numValue,
        },
      },
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {consultant ? "Edit Consultant" : "Add New Consultant"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="john.doe@company.com"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Solution Play Metrics</h3>
                <div className="space-y-4">
                  {SOLUTION_PLAYS.map((play) => (
                    <div key={play} className="p-4 border rounded-lg bg-muted/30">
                      <h4 className="font-medium mb-3 text-sm">{play}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`${play}-training`} className="text-xs">
                            Training Completed
                          </Label>
                          <Input
                            id={`${play}-training`}
                            type="number"
                            min="0"
                            value={formData.solutionPlays[play]?.trainingCompleted || 0}
                            onChange={(e) =>
                              updateSolutionPlay(play, "trainingCompleted", e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${play}-hours`} className="text-xs">
                            Hours Delivered
                          </Label>
                          <Input
                            id={`${play}-hours`}
                            type="number"
                            min="0"
                            value={formData.solutionPlays[play]?.hoursDelivered || 0}
                            onChange={(e) =>
                              updateSolutionPlay(play, "hoursDelivered", e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name || !formData.email}>
              {consultant ? "Update" : "Add"} Consultant
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
