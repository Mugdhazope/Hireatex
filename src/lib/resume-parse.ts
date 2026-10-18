import type { ParsedResumeData } from '@/types'

const COMMON_SKILLS = [
  'GCP',
  'ICH',
  'FDA',
  'EMA',
  'SAS',
  'R',
  'Python',
  'SQL',
  'HPLC',
  'GMP',
  'CAPA',
  'CDISC',
  'Medidata Rave',
  'Oracle Argus',
  'eCTD',
  'Pharmacovigilance',
  'Clinical Research',
  'Regulatory Affairs',
  'Biostatistics',
  'Medical Writing',
  'Oncology',
  'SOP',
  'Auditing',
]

function extractEmail(text: string): string | undefined {
  const m = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  return m?.[0]
}

function extractPhone(text: string): string | undefined {
  const m = text.match(
    /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/
  )
  return m?.[0]
}

function extractSkills(text: string): string[] {
  const lower = text.toLowerCase()
  return COMMON_SKILLS.filter((s) => lower.includes(s.toLowerCase()))
}

function extractName(text: string): string | undefined {
  const lines = text
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  const first = lines[0]
  if (!first) return undefined
  if (first.length < 60 && !first.includes('@') && /[a-zA-Z]/.test(first)) {
    return first.replace(/\s+/g, ' ')
  }
  return undefined
}

function extractEducation(text: string): ParsedResumeData['education'] {
  const edu: ParsedResumeData['education'] = []
  const patterns = [
    /(?:Bachelor|Master|PhD|Doctor|B\.?S\.?|M\.?S\.?|M\.?B\.?A\.?)[^\n]{0,80}/gi,
  ]
  for (const re of patterns) {
    const matches = text.match(re) ?? []
    for (const m of matches.slice(0, 5)) {
      const yearMatch = m.match(/(19|20)\d{2}/)
      edu.push({
        degree: m.trim().slice(0, 80),
        year: yearMatch ? Number(yearMatch[0]) : undefined,
      })
    }
  }
  return edu
}

function extractExperience(text: string): ParsedResumeData['experience'] {
  const exp: ParsedResumeData['experience'] = []
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean)
  for (let i = 0; i < lines.length && exp.length < 5; i++) {
    const line = lines[i]
    if (
      /\b(coordinator|associate|manager|specialist|analyst|officer|director|scientist|writer|liaison)\b/i.test(
        line
      ) &&
      line.length < 100
    ) {
      exp.push({
        title: line,
        company: lines[i + 1]?.slice(0, 80),
        description: lines.slice(i, i + 3).join(' ').slice(0, 200),
      })
    }
  }
  return exp
}

function buildParsed(rawText: string, warnings: string[]): ParsedResumeData {
  const trimmed = rawText.trim()
  if (!trimmed) {
    return {
      skills: [],
      education: [],
      experience: [],
      rawText: '',
      warnings: [...warnings, 'No text could be extracted from this file.'],
    }
  }

  return {
    fullName: extractName(trimmed),
    email: extractEmail(trimmed),
    phone: extractPhone(trimmed),
    skills: extractSkills(trimmed),
    education: extractEducation(trimmed),
    experience: extractExperience(trimmed),
    rawText: trimmed.slice(0, 20000),
    warnings,
  }
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist')
  // Use CDN worker matching installed pdfjs-dist version
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

  const data = new Uint8Array(await file.arrayBuffer())
  const loadingTask = pdfjs.getDocument({ data })
  const pdf = await loadingTask.promise
  const parts: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
    parts.push(pageText)
  }

  return parts.join('\n')
}

async function extractDocxText(file: File): Promise<string> {
  const mammoth = await import('mammoth')
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

export async function parseResumeFile(file: File): Promise<ParsedResumeData> {
  const name = file.name.toLowerCase()
  const warnings: string[] = []

  if (name.endsWith('.doc') && !name.endsWith('.docx')) {
    return {
      skills: [],
      education: [],
      experience: [],
      rawText: '',
      warnings: [
        'Legacy .doc files can be uploaded and stored, but text extraction is not supported in the browser. Convert to PDF or DOCX, or enter details manually.',
      ],
    }
  }

  try {
    let text = ''
    if (name.endsWith('.pdf') || file.type === 'application/pdf') {
      text = await extractPdfText(file)
    } else if (
      name.endsWith('.docx') ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      text = await extractDocxText(file)
    } else {
      return {
        skills: [],
        education: [],
        experience: [],
        rawText: '',
        warnings: [
          'Unsupported file type for parsing. Upload PDF or DOCX to extract text, or enter details manually.',
        ],
      }
    }

    if (!text.trim()) {
      warnings.push(
        'The file opened, but no readable text was found. You can still save the resume and fill your profile manually.'
      )
    }

    return buildParsed(text, warnings)
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown error while parsing resume'
    return {
      skills: [],
      education: [],
      experience: [],
      rawText: '',
      warnings: [
        `Could not parse this file (${message}). The file can still be saved; please enter profile details manually.`,
      ],
    }
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const RESUME_ACCEPT =
  '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export function validateResumeFile(file: File): string | null {
  const max = 5 * 1024 * 1024
  if (file.size > max) return 'File must be 5MB or smaller.'
  const name = file.name.toLowerCase()
  if (!name.endsWith('.pdf') && !name.endsWith('.doc') && !name.endsWith('.docx')) {
    return 'Only PDF, DOC, or DOCX files are allowed.'
  }
  return null
}
