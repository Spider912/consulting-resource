import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Consultant, Industry, INDUSTRIES, Region, REGIONS, SOLUTION_PLAYS } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConsultantCard } from "@/components/ConsultantCard"
import { ConsultantForm } from "@/components/ConsultantForm"
import { SkillsMatrix } from "@/components/SkillsMatrix"
import { AnalyticsView } from "@/components/AnalyticsView"
import { OverviewMetrics } from "@/components/OverviewMetrics"
import { CapabilitiesAssessment } from "@/components/CapabilitiesAssessment"
import { Plus, MagnifyingGlass, ChartBar, Funnel, X, UsersThree } from "@phosphor-icons/react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

function App() {
  const [consultants, setConsultants] = useKV<Consultant[]>("consultants", [])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingConsultant, setEditingConsultant] = useState<Consultant | undefined>()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustries, setSelectedIndustries] = useState<Industry[]>([])
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([])
  const [isIndustryFilterOpen, setIsIndustryFilterOpen] = useState(false)
  const [isRegionFilterOpen, setIsRegionFilterOpen] = useState(false)

  const consultantsList = consultants || []

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

  const generateSampleConsultants = () => {
    const names = [
      { name: "Michael Rodriguez", email: "michael.rodriguez@company.com" },
      { name: "Emily Watson", email: "emily.watson@company.com" },
      { name: "David Kim", email: "david.kim@company.com" },
      { name: "Jessica Martinez", email: "jessica.martinez@company.com" },
      { name: "Robert Johnson", email: "robert.johnson@company.com" },
      { name: "Amanda Chen", email: "amanda.chen@company.com" },
      { name: "Christopher Lee", email: "christopher.lee@company.com" },
      { name: "Maria Garcia", email: "maria.garcia@company.com" },
      { name: "James Wilson", email: "james.wilson@company.com" },
      { name: "Lisa Anderson", email: "lisa.anderson@company.com" },
      { name: "Daniel Brown", email: "daniel.brown@company.com" },
      { name: "Patricia Taylor", email: "patricia.taylor@company.com" },
      { name: "Matthew Davis", email: "matthew.davis@company.com" },
      { name: "Jennifer White", email: "jennifer.white@company.com" },
      { name: "Anthony Martin", email: "anthony.martin@company.com" },
      { name: "Laura Thompson", email: "laura.thompson@company.com" },
      { name: "Kevin Patel", email: "kevin.patel@company.com" },
      { name: "Michelle Zhang", email: "michelle.zhang@company.com" },
      { name: "Brian O'Connor", email: "brian.oconnor@company.com" },
      { name: "Nicole Singh", email: "nicole.singh@company.com" }
    ]

    const newConsultants: Consultant[] = names.map((person, index) => {
      const id = `consultant-${Date.now()}-${index}`
      
      const numIndustries = Math.floor(Math.random() * 3) + 2
      const shuffledIndustries = [...INDUSTRIES].sort(() => Math.random() - 0.5)
      const industries = shuffledIndustries.slice(0, numIndustries) as Industry[]
      
      const primaryIndustry = INDUSTRIES[index % INDUSTRIES.length] as Industry
      
      const region = REGIONS[index % REGIONS.length] as Region
      
      const solutionPlays: Record<string, any> = {}
      SOLUTION_PLAYS.forEach((play) => {
        const hasExperience = Math.random() > 0.3
        const hoursDelivered = hasExperience 
          ? Math.floor(Math.random() * 800) + 50
          : Math.floor(Math.random() * 30)
        
        solutionPlays[play] = {
          trainingCompleted: Math.floor(Math.random() * 10) + 2,
          hoursDelivered,
          preSalesHours: Math.floor(Math.random() * 150) + 10,
          articlesPosted: Math.floor(Math.random() * 15) + 2,
          certifications: Math.floor(Math.random() * 8) + 2
        }
      })

      return {
        id,
        name: person.name,
        email: person.email,
        industries,
        primaryIndustry,
        region,
        solutionPlays
      }
    })

    setConsultants(current => [...(current || []), ...newConsultants])
    toast.success(`Added ${newConsultants.length} consultant profiles`)
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

    return matchesSearch && matchesIndustry && matchesRegion
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
              <Button onClick={generateSampleConsultants} variant="outline" size="lg" className="gap-2">
                <UsersThree className="h-5 w-5" />
                Add 20 Profiles
              </Button>
              <Button onClick={handleAddNew} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Add Consultant
              </Button>
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

              <div className="text-sm text-muted-foreground">
                {filteredConsultants.length} of {consultantsList.length} consultants
              </div>
            </div>

            {(selectedIndustries.length > 0 || selectedRegions.length > 0) && (
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