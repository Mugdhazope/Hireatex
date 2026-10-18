'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Search, Filter } from 'lucide-react'

export interface JobFilters {
  query: string
  location: string
  experience: string
  jobType: string
  category: string
}

interface FilterBarProps {
  filters: JobFilters
  onChange: (filters: JobFilters) => void
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const set = (patch: Partial<JobFilters>) => onChange({ ...filters, ...patch })

  const filterFields = (
    <div className="space-y-4 md:space-y-0 md:flex md:gap-3">
      <Select
        value={filters.experience || 'all'}
        onValueChange={(v) => set({ experience: v === 'all' ? '' : v })}
      >
        <SelectTrigger className="w-full md:w-44">
          <SelectValue placeholder="Experience" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All experience</SelectItem>
          <SelectItem value="entry">Entry Level</SelectItem>
          <SelectItem value="mid">Mid Level</SelectItem>
          <SelectItem value="senior">Senior</SelectItem>
          <SelectItem value="lead">Lead</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.jobType || 'all'}
        onValueChange={(v) => set({ jobType: v === 'all' ? '' : v })}
      >
        <SelectTrigger className="w-full md:w-44">
          <SelectValue placeholder="Job Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value="full-time">Full Time</SelectItem>
          <SelectItem value="part-time">Part Time</SelectItem>
          <SelectItem value="contract">Contract</SelectItem>
          <SelectItem value="internship">Internship</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.category || 'all'}
        onValueChange={(v) => set({ category: v === 'all' ? '' : v })}
      >
        <SelectTrigger className="w-full md:w-52">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          <SelectItem value="clinical-research">Clinical Research</SelectItem>
          <SelectItem value="regulatory-affairs">Regulatory Affairs</SelectItem>
          <SelectItem value="pharmacovigilance">Pharmacovigilance</SelectItem>
          <SelectItem value="medical-affairs">Medical Affairs</SelectItem>
          <SelectItem value="quality-assurance">Quality Assurance</SelectItem>
          <SelectItem value="data-management">Data Management</SelectItem>
          <SelectItem value="biostatistics">Biostatistics</SelectItem>
          <SelectItem value="medical-writing">Medical Writing</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
          <Input
            placeholder="Search jobs, skills, or roles"
            className="pl-10"
            value={filters.query}
            onChange={(e) => set({ query: e.target.value })}
          />
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Location"
            className="min-w-0 flex-1 sm:w-44 sm:flex-none md:w-48"
            value={filters.location}
            onChange={(e) => set({ location: e.target.value })}
          />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="shrink-0 md:hidden">
                <Filter className="h-4 w-4" />
                <span className="ml-1.5">Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-[100vw] sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">{filterFields}</div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="hidden md:block">{filterFields}</div>
    </div>
  )
}
