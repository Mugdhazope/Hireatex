import type { Application } from '@/types'

export const applications: Application[] = [
  // Job 1: Clinical Research Associate - BioPharm Solutions
  {
    id: 'app-1',
    candidateId: 'cand-1',
    jobId: 'job-1',
    status: 'shortlisted',
    appliedDate: new Date('2026-08-16'),
    resumeUrl: '/resumes/sarah-chen.pdf',
    internalNotes: 'Strong CRC background, relevant experience at Mass General.',
  },
  {
    id: 'app-2',
    candidateId: 'cand-11',
    jobId: 'job-1',
    status: 'applied',
    appliedDate: new Date('2026-08-30'),
    resumeUrl: '/resumes/kevin-zhang.pdf',
  },
  
  // Job 2: Senior Regulatory Affairs Specialist - MedTech Innovations
  {
    id: 'app-3',
    candidateId: 'cand-2',
    jobId: 'job-2',
    status: 'under_review',
    appliedDate: new Date('2026-08-21'),
    resumeUrl: '/resumes/michael-rodriguez.pdf',
    internalNotes: 'Good background at Genentech, may need more device experience.',
  },
  
  // Job 3: Pharmacovigilance Officer - Global Pharma Corp
  {
    id: 'app-4',
    candidateId: 'cand-3',
    jobId: 'job-3',
    status: 'interview',
    appliedDate: new Date('2026-08-26'),
    resumeUrl: '/resumes/emily-thompson.pdf',
    internalNotes: 'PharmD candidate, invited for interview on Sept 10.',
  },
  {
    id: 'app-5',
    candidateId: 'cand-12',
    jobId: 'job-3',
    status: 'shortlisted',
    appliedDate: new Date('2026-08-27'),
    resumeUrl: '/resumes/maria-garcia.pdf',
    internalNotes: 'Current PV experience at J&J, strong candidate.',
  },
  
  // Job 4: Medical Science Liaison - Oncology Therapeutics Inc
  {
    id: 'app-6',
    candidateId: 'cand-4',
    jobId: 'job-4',
    status: 'forwarded',
    appliedDate: new Date('2026-08-11'),
    resumeUrl: '/resumes/james-wilson.pdf',
    internalNotes: 'PhD with MSL experience. Forwarded to Oncology Therapeutics on Aug 28.',
  },
  
  // Job 5: Quality Assurance Specialist - BioManufacturing Solutions
  {
    id: 'app-7',
    candidateId: 'cand-5',
    jobId: 'job-5',
    status: 'shortlisted',
    appliedDate: new Date('2026-08-19'),
    resumeUrl: '/resumes/priya-patel.pdf',
    internalNotes: 'Good QA background at Biogen.',
  },
  
  // Job 6: Clinical Data Manager - Clinical Trials Network
  {
    id: 'app-8',
    candidateId: 'cand-6',
    jobId: 'job-6',
    status: 'under_review',
    appliedDate: new Date('2026-08-23'),
    resumeUrl: '/resumes/david-lee.pdf',
  },
  
  // Job 7: Biostatistician - Statistical Sciences Group
  {
    id: 'app-9',
    candidateId: 'cand-7',
    jobId: 'job-7',
    status: 'selected',
    appliedDate: new Date('2026-08-13'),
    resumeUrl: '/resumes/amanda-foster.pdf',
    internalNotes: 'Excellent candidate. Company selected for hire.',
  },
  
  // Job 8: Medical Writer - Scientific Communications LLC
  {
    id: 'app-10',
    candidateId: 'cand-8',
    jobId: 'job-8',
    status: 'forwarded',
    appliedDate: new Date('2026-08-29'),
    resumeUrl: '/resumes/jessica-martinez.pdf',
    internalNotes: 'Medical writer with good regulatory experience. Forwarded Sept 2.',
  },
  
  // Job 9: Clinical Research Coordinator - University Medical Center
  {
    id: 'app-11',
    candidateId: 'cand-9',
    jobId: 'job-9',
    status: 'applied',
    appliedDate: new Date('2026-08-31'),
    resumeUrl: '/resumes/robert-johnson.pdf',
  },
  {
    id: 'app-12',
    candidateId: 'cand-1',
    jobId: 'job-9',
    status: 'rejected',
    appliedDate: new Date('2026-09-01'),
    resumeUrl: '/resumes/sarah-chen.pdf',
    internalNotes: 'Overqualified for entry-level position.',
  },
  
  // Job 10: Regulatory Affairs Manager - Vaccine Development Corp
  {
    id: 'app-13',
    candidateId: 'cand-10',
    jobId: 'job-10',
    status: 'interview',
    appliedDate: new Date('2026-08-06'),
    resumeUrl: '/resumes/lisa-anderson.pdf',
    internalNotes: 'Vaccine experience at Novavax. Interview scheduled Sept 12.',
  },
  
  // Job 11: Clinical Operations Associate - CRO Partners
  {
    id: 'app-14',
    candidateId: 'cand-11',
    jobId: 'job-11',
    status: 'under_review',
    appliedDate: new Date('2026-08-27'),
    resumeUrl: '/resumes/kevin-zhang.pdf',
  },
  
  // Job 12: Senior Pharmacovigilance Specialist - Drug Safety Solutions
  {
    id: 'app-15',
    candidateId: 'cand-12',
    jobId: 'job-12',
    status: 'shortlisted',
    appliedDate: new Date('2026-08-15'),
    resumeUrl: '/resumes/maria-garcia.pdf',
    internalNotes: 'Strong PV background, good fit for senior role.',
  },
  
  // Job 13: Quality Control Analyst - BioTech Manufacturing
  {
    id: 'app-16',
    candidateId: 'cand-13',
    jobId: 'job-13',
    status: 'applied',
    appliedDate: new Date('2026-08-25'),
    resumeUrl: '/resumes/thomas-brown.pdf',
  },
  
  // Job 14: Clinical Trial Manager - Neuroscience Research Institute
  {
    id: 'app-17',
    candidateId: 'cand-14',
    jobId: 'job-14',
    status: 'forwarded',
    appliedDate: new Date('2026-08-09'),
    resumeUrl: '/resumes/jennifer-taylor.pdf',
    internalNotes: 'Neuroscience background, forwarded to institute on Aug 22.',
  },
  
  // Job 15: Regulatory Submissions Coordinator - Emerging Biotech Inc
  {
    id: 'app-18',
    candidateId: 'cand-15',
    jobId: 'job-15',
    status: 'under_review',
    appliedDate: new Date('2026-08-20'),
    resumeUrl: '/resumes/christopher-davis.pdf',
  },
  
  // Additional applications from other candidates
  {
    id: 'app-19',
    candidateId: 'cand-2',
    jobId: 'job-15',
    status: 'applied',
    appliedDate: new Date('2026-08-21'),
    resumeUrl: '/resumes/michael-rodriguez.pdf',
  },
  {
    id: 'app-20',
    candidateId: 'cand-5',
    jobId: 'job-13',
    status: 'rejected',
    appliedDate: new Date('2026-08-26'),
    resumeUrl: '/resumes/priya-patel.pdf',
    internalNotes: 'Looking for pure QC lab role, candidate has QA background.',
  },
  {
    id: 'app-21',
    candidateId: 'cand-6',
    jobId: 'job-7',
    status: 'applied',
    appliedDate: new Date('2026-08-14'),
    resumeUrl: '/resumes/david-lee.pdf',
  },
  {
    id: 'app-22',
    candidateId: 'cand-8',
    jobId: 'job-4',
    status: 'rejected',
    appliedDate: new Date('2026-08-12'),
    resumeUrl: '/resumes/jessica-martinez.pdf',
    internalNotes: 'Medical writer background, not MSL qualified.',
  },
  {
    id: 'app-23',
    candidateId: 'cand-10',
    jobId: 'job-2',
    status: 'applied',
    appliedDate: new Date('2026-08-22'),
    resumeUrl: '/resumes/lisa-anderson.pdf',
  },
  {
    id: 'app-24',
    candidateId: 'cand-13',
    jobId: 'job-5',
    status: 'applied',
    appliedDate: new Date('2026-08-20'),
    resumeUrl: '/resumes/thomas-brown.pdf',
  },
  {
    id: 'app-25',
    candidateId: 'cand-15',
    jobId: 'job-2',
    status: 'under_review',
    appliedDate: new Date('2026-08-23'),
    resumeUrl: '/resumes/christopher-davis.pdf',
  },
]
