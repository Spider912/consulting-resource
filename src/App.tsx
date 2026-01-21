import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Consultant } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConsultantCard } from "@/components/ConsultantCard"
import { ConsultantForm } from "@/components/ConsultantForm"
import { SkillsMatrix } from "@/components/SkillsMatrix"
import { AnalyticsView } from "@/components/AnalyticsView"
import { OverviewMetrics } from "@/components/OverviewMetrics"
import { Plus, MagnifyingGlass, ChartBar } from "@phosphor-icons/react"
import { toast } from "sonner"

function App() {
  const [consultants, setConsultants] = useKV<Consultant[]>("consultants", [])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingConsultant, setEditingConsultant] = useState<Consultant | undefined>()
  const [searchQuery, setSearchQuery] = useState("")

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

  const filteredConsultants = consultantsList.filter(consultant =>
    consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    consultant.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <ChartBar className="h-8 w-8 text-primary" weight="duotone" />
                Resource Manager Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Track consultant skills and delivery across solution plays
              </p>
            </div>
            <Button onClick={handleAddNew} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add Consultant
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="matrix">Skills Matrix</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewMetrics consultants={consultantsList} />

            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search consultants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredConsultants.length} of {consultantsList.length} consultants
              </div>
            </div>

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