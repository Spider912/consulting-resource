import { useState, useEffect } from "react"
import { useKV } from "@github/spark/hooks"
import { Consultant, Industry, INDUSTRIES, Region, REGIONS, SOLUTION_PLAYS, SolutionPlay, SOLUTION_AREAS, SolutionArea } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConsultantCard } from "@/components/ConsultantCard"
import { ConsultantForm } from "@/components/ConsultantForm"
import { SkillsMatrix } from "@/components/SkillsMatrix"
import { AnalyticsView } from "@/components/AnalyticsView"
import { OverviewMetrics } from "@/components/OverviewMetrics"
import { CapabilitiesAssessment } from "@/components/CapabilitiesAssessment"
import { Plus, MagnifyingGlass, ChartBar, Funnel, X } from "@phosphor-icons/react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

function App() {
  const [consultants, setConsultants] = useKV<Consultant[]>("consultants", [])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingConsultant, setEditingConsultant] = useState<Consultant | undefined>()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustries, setSelectedIndustries] = useState<Industry[]>([])
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([])
  const [selectedSolutionPlays, setSelectedSolutionPlays] = useState<SolutionPlay[]>([])
  const [selectedSolutionAreas, setSelectedSolutionAreas] = useState<SolutionArea[]>([])
  const [isIndustryFilterOpen, setIsIndustryFilterOpen] = useState(false)
  const [isRegionFilterOpen, setIsRegionFilterOpen] = useState(false)
  const [isSolutionPlayFilterOpen, setIsSolutionPlayFilterOpen] = useState(false)
  const [isSolutionAreaFilterOpen, setIsSolutionAreaFilterOpen] = useState(false)
  const [user, setUser] = useState<{ login: string; avatarUrl: string; email: string } | null>(null)

  const consultantsList = consultants || []

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await window.spark.user()
        setUser(userData)
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (consultantsList.length > 0) {
      const needsUpdate = consultantsList.some(c => !c.email.endsWith('@microsoft.com'))
      if (needsUpdate) {
        setConsultants(current => {
          const list = current || []
          return list.map(consultant => {
            if (!consultant.email.endsWith('@microsoft.com')) {
              const username = consultant.email.split('@')[0]
              return {
                ...consultant,
                email: `${username}@microsoft.com`
              }
            }
            return consultant
          })
        })
        toast.success("All consultant emails updated to @microsoft.com")
      }
    }
  }, [])

  const handleSaveConsultant = (consultant: Consultant) => {
    setConsultants(current => {
      const list = current || []
      const existing = list.find(c => c.id === consultant.id)
      if (existing) {
        toast.success("Consultant updated successfully")
        return list.map(c => c.id === consultant.id ? consultant : c)
      } else {
        toast.success("Consultant added successfully")
        return [...list, consultant]
      }
    })
    setEditingConsultant(undefined)
  }

  const handleEditConsultant = (consultant: Consultant) => {
    setEditingConsultant(consultant)
    setIsFormOpen(true)
  }

  const handleDeleteConsultant = (id: string) => {
    if (confirm("Are you sure you want to delete this consultant?")) {
      setConsultants(current => (current || []).filter(c => c.id !== id))
      toast.success("Consultant deleted successfully")
    }
  }

  const handleAddNew = () => {
    setEditingConsultant(undefined)
    setIsFormOpen(true)
  }

  const toggleIndustryFilter = (industry: Industry) => {
    setSelectedIndustries(prev =>
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    )
  }

  const clearIndustryFilters = () => {
    setSelectedIndustries([])
  }

  const toggleRegionFilter = (region: Region) => {
    setSelectedRegions(prev =>
      prev.includes(region)
        ? prev.filter(r => r !== region)
        : [...prev, region]
    )
  }

  const clearRegionFilters = () => {
    setSelectedRegions([])
  }

  const toggleSolutionPlayFilter = (play: SolutionPlay) => {
    setSelectedSolutionPlays(prev =>
      prev.includes(play)
        ? prev.filter(p => p !== play)
        : [...prev, play]
    )
  }

  const clearSolutionPlayFilters = () => {
    setSelectedSolutionPlays([])
  }

  const toggleSolutionAreaFilter = (area: SolutionArea) => {
    setSelectedSolutionAreas(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    )
  }

  const clearSolutionAreaFilters = () => {
    setSelectedSolutionAreas([])
  }

  const filteredConsultants = consultantsList.filter(consultant => {
    const matchesSearch =
      consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultant.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesIndustry =
      selectedIndustries.length === 0 ||
      (consultant.industries &&
        selectedIndustries.some(industry => consultant.industries?.includes(industry)))

    const matchesRegion =
      selectedRegions.length === 0 ||
      (consultant.region && selectedRegions.includes(consultant.region))

    const matchesSolutionPlay =
      selectedSolutionPlays.length === 0 ||
      selectedSolutionPlays.some(play => 
        consultant.solutionPlays[play] && consultant.solutionPlays[play].hoursDelivered > 0
      )

    const solutionAreaToPlaysMap: Record<SolutionArea, SolutionPlay[]> = {
      "Cloud and AI Platform": [
        "Migrate and Modernize your Estate",
        "Innovate with Azure",
        "Unify Your Data Platform",
        "Scale with Cloud and AI Endpoints"
      ] as SolutionPlay[],
      "AI Business Solutions": [
        "AI Apps and Agents",
        "Copilot and Agents at Work",
        "Innovate with Low Code AI and Agents",
        "Sales Transformation with AI",
        "Service Transformation with AI",
        "ERP Transformation with AI",
        "Scale Business Operations with AI",
        "AI Ready with Surface Copilot PCs"
      ] as SolutionPlay[],
      "Security": [
        "Secure AI Productivity",
        "Modern SecOps with Unified Platform",
        "Data Security",
        "Protect Cloud AI Platform and Apps",
        "Converged Communications"
      ] as SolutionPlay[]
    }

    const matchesSolutionArea =
      selectedSolutionAreas.length === 0 ||
      selectedSolutionAreas.some(area => {
        const relatedPlays = solutionAreaToPlaysMap[area]
        return relatedPlays.some(play =>
          consultant.solutionPlays[play] && consultant.solutionPlays[play].hoursDelivered > 0
        )
      })

    return matchesSearch && matchesIndustry && matchesRegion && matchesSolutionPlay && matchesSolutionArea
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <ChartBar className="h-8 w-8 text-primary" weight="duotone" />
                Capabilities Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Track consultant skills and delivery across solution plays
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/50">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl} alt={user.login} />
                    <AvatarFallback>{user.login.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user.login}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="matrix">Skills Matrix</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="capabilities">Capabilities Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewMetrics consultants={consultantsList} />

            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search consultants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Popover open={isIndustryFilterOpen} onOpenChange={setIsIndustryFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Funnel className="h-4 w-4" />
                    Industry
                    {selectedIndustries.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                        {selectedIndustries.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="start">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">Filter by Industry</h4>
                      {selectedIndustries.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearIndustryFilters}
                          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {INDUSTRIES.map((industry) => (
                        <div key={industry} className="flex items-center space-x-2">
                          <Checkbox
                            id={`industry-${industry}`}
                            checked={selectedIndustries.includes(industry)}
                            onCheckedChange={() => toggleIndustryFilter(industry)}
                          />
                          <Label
                            htmlFor={`industry-${industry}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {industry}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={isRegionFilterOpen} onOpenChange={setIsRegionFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Funnel className="h-4 w-4" />
                    Region
                    {selectedRegions.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                        {selectedRegions.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="start">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">Filter by Region</h4>
                      {selectedRegions.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearRegionFilters}
                          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {REGIONS.map((region) => (
                        <div key={region} className="flex items-center space-x-2">
                          <Checkbox
                            id={`region-${region}`}
                            checked={selectedRegions.includes(region)}
                            onCheckedChange={() => toggleRegionFilter(region)}
                          />
                          <Label
                            htmlFor={`region-${region}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {region}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={isSolutionPlayFilterOpen} onOpenChange={setIsSolutionPlayFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Funnel className="h-4 w-4" />
                    Solution Play
                    {selectedSolutionPlays.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                        {selectedSolutionPlays.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 max-h-96 overflow-y-auto" align="start">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">Filter by Solution Play</h4>
                      {selectedSolutionPlays.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearSolutionPlayFilters}
                          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {SOLUTION_PLAYS.map((play) => (
                        <div key={play} className="flex items-center space-x-2">
                          <Checkbox
                            id={`play-${play}`}
                            checked={selectedSolutionPlays.includes(play)}
                            onCheckedChange={() => toggleSolutionPlayFilter(play)}
                          />
                          <Label
                            htmlFor={`play-${play}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {play}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={isSolutionAreaFilterOpen} onOpenChange={setIsSolutionAreaFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Funnel className="h-4 w-4" />
                    Solution Area
                    {selectedSolutionAreas.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                        {selectedSolutionAreas.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="start">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">Filter by Solution Area</h4>
                      {selectedSolutionAreas.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearSolutionAreaFilters}
                          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {SOLUTION_AREAS.map((area) => (
                        <div key={area} className="flex items-center space-x-2">
                          <Checkbox
                            id={`area-${area}`}
                            checked={selectedSolutionAreas.includes(area)}
                            onCheckedChange={() => toggleSolutionAreaFilter(area)}
                          />
                          <Label
                            htmlFor={`area-${area}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {area}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="text-sm text-muted-foreground">
                {filteredConsultants.length} of {consultantsList.length} consultants
              </div>
            </div>

            {(selectedIndustries.length > 0 || selectedRegions.length > 0 || selectedSolutionPlays.length > 0 || selectedSolutionAreas.length > 0) && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedIndustries.map((industry) => (
                  <Badge key={industry} variant="secondary" className="gap-1 pl-3 pr-2">
                    {industry}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => toggleIndustryFilter(industry)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {selectedRegions.map((region) => (
                  <Badge key={region} variant="secondary" className="gap-1 pl-3 pr-2">
                    {region}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => toggleRegionFilter(region)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {selectedSolutionPlays.map((play) => (
                  <Badge key={play} variant="secondary" className="gap-1 pl-3 pr-2">
                    {play}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => toggleSolutionPlayFilter(play)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {selectedSolutionAreas.map((area) => (
                  <Badge key={area} variant="secondary" className="gap-1 pl-3 pr-2">
                    {area}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => toggleSolutionAreaFilter(area)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            {filteredConsultants.length === 0 && consultantsList.length > 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No consultants match your search
              </div>
            ) : filteredConsultants.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No consultants yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by adding your first consultant to track their skills and delivery hours
                </p>
                <Button onClick={handleAddNew} size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Add First Consultant
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredConsultants.map(consultant => (
                  <ConsultantCard
                    key={consultant.id}
                    consultant={consultant}
                    onEdit={handleEditConsultant}
                    onDelete={handleDeleteConsultant}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="matrix">
            <SkillsMatrix consultants={consultantsList} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsView consultants={consultantsList} />
          </TabsContent>

          <TabsContent value="capabilities">
            <CapabilitiesAssessment consultants={consultantsList} />
          </TabsContent>
        </Tabs>
      </div>

      <ConsultantForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingConsultant(undefined)
        }}
        onSave={handleSaveConsultant}
        consultant={editingConsultant}
      />
    </div>
  )
}

export default App