import api from '@/services/api'

export interface DiagnosisRecord {
  id: string
  createdAt: string
  childFirstName: string
  childLastName: string
  childBirthDate: string
  consultationReason: string
  behaviorChanges?: string[] | null
  clinicalSigns?: string[] | null
  duration: string
  worryLevel: string
  actionsTaken?: string[] | null
  additionalNotes?: string | null
  status?: string | null
}

export interface DoctorFormSummary {
  id: string
  patientFirstName: string
  patientLastName: string
  consultationReason: string
  submittedAt: string
  status: string
}

export interface DoctorFormDetail extends DoctorFormSummary {
  childBirthDate: string
  behaviorChanges: string[]
  clinicalSigns: string[]
  duration: string
  worryLevel: string
  actionsTaken: string[]
  additionalNotes: string
}

export interface DoctorFormsListParams {
  search?: string
}

const normalizeText = (value: string) =>
  value
    .toLocaleLowerCase('fr-FR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const safeArray = (value?: string[] | null) => (Array.isArray(value) ? value : [])

const toSummary = (record: DiagnosisRecord): DoctorFormSummary => ({
  id: record.id,
  patientFirstName: record.childFirstName,
  patientLastName: record.childLastName,
  consultationReason: record.consultationReason,
  submittedAt: record.createdAt,
  status: record.status ?? 'new',
})

const toDetail = (record: DiagnosisRecord): DoctorFormDetail => ({
  ...toSummary(record),
  childBirthDate: record.childBirthDate,
  behaviorChanges: safeArray(record.behaviorChanges),
  clinicalSigns: safeArray(record.clinicalSigns),
  duration: record.duration,
  worryLevel: record.worryLevel,
  actionsTaken: safeArray(record.actionsTaken),
  additionalNotes: record.additionalNotes ?? '',
})

const matchesSearch = (record: DiagnosisRecord, search: string) => {
  if (!search) return true
  const normalized = normalizeText(search)
  const fields = [
    record.childFirstName,
    record.childLastName,
    record.consultationReason,
    record.id,
  ]
  return fields.some((field) => normalizeText(field).includes(normalized))
}

export const doctorFormsApi = {
  async list(params: DoctorFormsListParams = {}): Promise<DoctorFormSummary[]> {
    const data = (await api.diagnosis.list()) as DiagnosisRecord[]
    const search = params.search?.trim() ?? ''

    return data
      .filter((record) => matchesSearch(record, search))
      .map(toSummary)
  },

  async get(id: string): Promise<DoctorFormDetail> {
    const data = (await api.diagnosis.list()) as DiagnosisRecord[]
    const match = data.find((record) => record.id === id)
    if (!match) {
      throw new Error('Formulaire introuvable')
    }
    return toDetail(match)
  },
}

export default doctorFormsApi
