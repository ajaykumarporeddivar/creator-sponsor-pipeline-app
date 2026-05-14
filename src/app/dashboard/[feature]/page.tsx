'use client'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '@/components/ui'
import { AppHeader } from '@/components/layout'
import { formatDate, formatCurrency } from '@/lib/utils'
// ⚠ Import ONLY the MOCK arrays defined in your SPEC CONTRACT Entity Reference Table:
import { MOCK_CREATORS, MOCK_SPONSORS, MOCK_SPONSORSHIP_DEALS, MOCK_DELIVERABLES } from '@/lib/data'
import { Search, Plus, Download, Eye, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import type { ISponsorshipDeal, ISponsor, IDeliverable } from '@/lib/types'

export default function FeaturePage() {
  const params = useParams()
  const slug = (params.feature as string) ?? ''
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null)

  // ── Feature 1: Sponsor Deal Intake (/dashboard/intake) ──────────────────────
  if (slug === 'intake') {
    const [sponsorName, setSponsorName] = useState('')
    const [contactEmail, setContactEmail] = useState('')
    const [campaignName, setCampaignName] = useState('')
    const [proposedValue, setProposedValue] = useState<number | ''>('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [notes, setNotes] = useState('')
    const [deliverableDescription, setDeliverableDescription] = useState('')
    const [deliverableDueDate, setDeliverableDueDate] = useState('')
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
    const [showSuccess, setShowSuccess] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const errors: { [key: string]: string } = {}
      if (!sponsorName) errors.sponsorName = 'Sponsor name is required.'
      if (!campaignName) errors.campaignName = 'Campaign name is required.'
      if (!deliverableDescription) errors.deliverableDescription = 'Deliverable description is required.'
      if (!deliverableDueDate) errors.deliverableDueDate = 'Deliverable due date is required.'
      if (!startDate) errors.startDate = 'Start date is required.'
      if (!endDate) errors.endDate = 'End date is required.'

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        return
      }

      // Simulate new deal creation
      const newDeal: Partial<ISponsorshipDeal> = {
        campaignName,
        description: campaignName, // Using campaign name as description for simplicity
        proposedValue: typeof proposedValue === 'number' ? proposedValue : 0,
        startDate,
        endDate,
        notes,
        status: 'lead',
        // In a real app, sponsorId/creatorId would be resolved
        // deliverables: [{ description: deliverableDescription, dueDate: deliverableDueDate }]
      }
      console.log('Simulating new deal creation:', newDeal)

      // Reset form
      setSponsorName('')
      setContactEmail('')
      setCampaignName('')
      setProposedValue('')
      setStartDate('')
      setEndDate('')
      setNotes('')
      setDeliverableDescription('')
      setDeliverableDueDate('')
      setFormErrors({})
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }

    return (
      <div className="space-y-6">
        <AppHeader
          title="New Sponsor Deal"
          subtitle="Add a new sponsorship lead to your pipeline"
          actions={<Button size="sm" onClick={handleSubmit}><Plus size={14} className="mr-1" />Create Deal</Button>}
        />
        {showSuccess && (
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm">
            <CheckCircle size={16} /> Deal intake submitted successfully!
          </div>
        )}
        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sponsorName" className="block text-sm font-medium text-zinc-700 mb-1">Sponsor Name <span className="text-red-500">*</span></label>
                <Input
                  id="sponsorName"
                  value={sponsorName}
                  onChange={e => setSponsorName(e.target.value)}
                  placeholder="e.g., Brandify Co."
                  required
                />
                {formErrors.sponsorName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{formErrors.sponsorName}</p>}
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-zinc-700 mb-1">Contact Email</label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="sponsor@example.com"
                />
              </div>
              <div>
                <label htmlFor="campaignName" className="block text-sm font-medium text-zinc-700 mb-1">Campaign Name <span className="text-red-500">*</span></label>
                <Input
                  id="campaignName"
                  value={campaignName}
                  onChange={e => setCampaignName(e.target.value)}
                  placeholder="e.g., Summer Influencer Campaign"
                  required
                />
                {formErrors.campaignName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{formErrors.campaignName}</p>}
              </div>
              <div>
                <label htmlFor="proposedValue" className="block text-sm font-medium text-zinc-700 mb-1">Proposed Value ($)</label>
                <Input
                  id="proposedValue"
                  type="number"
                  value={proposedValue}
                  onChange={e => setProposedValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="e.g., 2500"
                />
              </div>
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-zinc-700 mb-1">Start Date <span className="text-red-500">*</span></label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  required
                />
                {formErrors.startDate && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{formErrors.startDate}</p>}
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-zinc-700 mb-1">End Date <span className="text-red-500">*</span></label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  required
                />
                {formErrors.endDate && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{formErrors.endDate}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-zinc-700 mb-1">Notes</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                  placeholder="Initial communication, internal context, etc."
                />
              </div>

              <div className="md:col-span-2 mt-4 border-t border-zinc-100 pt-4">
                <h3 className="font-semibold text-zinc-800 mb-3">Key Deliverable (Primary)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="deliverableDescription" className="block text-sm font-medium text-zinc-700 mb-1">Description <span className="text-red-500">*</span></label>
                    <Input
                      id="deliverableDescription"
                      value={deliverableDescription}
                      onChange={e => setDeliverableDescription(e.target.value)}
                      placeholder="e.g., 1 YouTube integration (60s)"
                      required
                    />
                    {formErrors.deliverableDescription && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{formErrors.deliverableDescription}</p>}
                  </div>
                  <div>
                    <label htmlFor="deliverableDueDate" className="block text-sm font-medium text-zinc-700 mb-1">Due Date <span className="text-red-500">*</span></label>
                    <Input
                      id="deliverableDueDate"
                      type="date"
                      value={deliverableDueDate}
                      onChange={e => setDeliverableDueDate(e.target.value)}
                      required
                    />
                    {formErrors.deliverableDueDate && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{formErrors.deliverableDueDate}</p>}
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="px-6 py-4 border-t border-zinc-100 flex justify-end">
              <Button type="submit">Create Deal</Button>
            </div>
          </form>
        </Card>
      </div>
    )
  }

  // Common function for badge variant based on SponsorshipDeal status
  const getDealBadgeVariant = (status: ISponsorshipDeal['status']): 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case 'approved':
      case 'completed':
      case 'paid':
        return 'success';
      case 'in_progress':
      case 'negotiating':
      case 'proposed':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'lead':
      case 'archived':
      default:
        return 'info';
    }
  };

  // ── Feature 2: Pipeline Dashboard (/dashboard/dashboard) ──────────────────────
  if (slug === 'dashboard') {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const filteredDeals = MOCK_SPONSORSHIP_DEALS.filter(deal => {
      const sponsor = MOCK_SPONSORS.find(s => s.id === deal.sponsorId);
      const sponsorName = sponsor?.name || 'Unknown Sponsor';
      const searchTerm = search.toLowerCase();

      const matchesSearch = !searchTerm ||
        deal.campaignName.toLowerCase().includes(searchTerm) ||
        sponsorName.toLowerCase().includes(searchTerm);

      const matchesStatus = !statusFilter || deal.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    const totalActiveDeals = MOCK_SPONSORSHIP_DEALS.filter(
      deal => ['proposed', 'negotiating', 'approved', 'in_progress'].includes(deal.status)
    ).length;

    const dealsOverdue = MOCK_SPONSORSHIP_DEALS.filter(
      deal => deal.status === 'in_progress' && new Date(deal.endDate) < today
    ).length;

    const dealsCompletedThisMonth = MOCK_SPONSORSHIP_DEALS.filter(
      deal => ['completed', 'paid'].includes(deal.status) &&
              new Date(deal.endDate).getMonth() === currentMonth &&
              new Date