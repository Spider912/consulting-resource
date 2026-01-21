import { useState, useEffect } from "react"
import { Consultant, SOLUTION_PLAYS, SolutionPlayData, INDUSTRIES, Industry, REGIONS, Region } from "@/lib/types"
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
import { Badge } from "@/components/ui/badge"
import { X } from "@phosphor-icons/react"

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
    industries: [],
    primaryIndustry: undefined,
    region: undefined,
    solutionPlays: {},
  })
  const [selectedIndustry, setSelectedIndustry] = useState<string>("")

  useEffect(() => {
    if (consultant) {
      setFormData(consultant)
    } else {
      setFormData({
        id: Date.now().toString(),
        name: "",
        email: "",
        industries: [],
        primaryIndustry: undefined,
        region: undefined,
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
          preSalesHours: prev.solutionPlays[play]?.preSalesHours || 0,
          articlesPosted: prev.solutionPlays[play]?.articlesPosted || 0,
          certifications: prev.solutionPlays[play]?.certifications || 0,
          [field]: numValue,
        },
      },
    }))
  }

  const addIndustry = (industry: Industry) => {
    if (!formData.industries?.includes(industry)) {
      setFormData(prev => ({
        ...prev,
        industries: [...(prev.industries || []), industry]
      }))
    }
    setSelectedIndustry("")
  }

  const removeIndustry = (industry: Industry) => {
    setFormData(prev => ({
      ...prev,
      industries: (prev.industries || []).filter(i => i !== industry)
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

                <div className="grid gap-2">
                  <Label htmlFor="region">Region</Label>
                  <select
                    id="region"
                    value={formData.region || ""}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value as Region || undefined })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a region...</option>
                    {REGIONS.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="primaryIndustry">Primary Industry Expertise</Label>
                  <select
                    id="primaryIndustry"
                    value={formData.primaryIndustry || ""}
                    onChange={(e) => setFormData({ ...formData, primaryIndustry: e.target.value as Industry || undefined })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select primary industry...</option>
                    {INDUSTRIES.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="industries">Additional Industry Experience</Label>
                  <div className="flex gap-2">
                    <select
                      id="industries"
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select an industry...</option>
                      {INDUSTRIES.filter(ind => !formData.industries?.includes(ind)).map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      onClick={() => selectedIndustry && addIndustry(selectedIndustry as Industry)}
                      disabled={!selectedIndustry}
                      variant="secondary"
                    >
                      Add
                    </Button>
                  </div>
                  {formData.industries && formData.industries.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.industries.map(industry => (
                        <Badge key={industry} variant="secondary" className="gap-1 pl-3 pr-2">
                          {industry}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeIndustry(industry)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
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
                        <div>
                          <Label htmlFor={`${play}-presales`} className="text-xs">
                            Pre-Sales Hours
                          </Label>
                          <Input
                            id={`${play}-presales`}
                            type="number"
                            min="0"
                            value={formData.solutionPlays[play]?.preSalesHours || 0}
                            onChange={(e) =>
                              updateSolutionPlay(play, "preSalesHours", e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${play}-articles`} className="text-xs">
                            Articles Posted
                          </Label>
                          <Input
                            id={`${play}-articles`}
                            type="number"
                            min="0"
                            value={formData.solutionPlays[play]?.articlesPosted || 0}
                            onChange={(e) =>
                              updateSolutionPlay(play, "articlesPosted", e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${play}-certifications`} className="text-xs">
                            Certifications
                          </Label>
                          <Input
                            id={`${play}-certifications`}
                            type="number"
                            min="0"
                            value={formData.solutionPlays[play]?.certifications || 0}
                            onChange={(e) =>
                              updateSolutionPlay(play, "certifications", e.target.value)
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
