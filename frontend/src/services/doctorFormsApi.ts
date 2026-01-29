export type DoctorFormStatus = 'new' | 'in_review' | 'completed'

export interface DoctorFormSummary {
  id: string
  patientFirstName: string
  patientLastName: string
  patientIdentifier: string
  consultationReason: string
  submittedAt: string
  status: DoctorFormStatus
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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const USE_MOCKS = import.meta.env.VITE_USE_MOCK_DOCTOR_FORMS !== 'false'

const MOCK_FORMS: DoctorFormDetail[] = [
  {
    id: 'frm-2026-001',
    patientFirstName: 'Lea',
    patientLastName: 'Durand',
    patientIdentifier: 'PAT-00452',
    consultationReason: 'Fievre persistante depuis 48h',
    submittedAt: '2026-01-27T09:12:00.000Z',
    status: 'new',
    childBirthDate: '2021-05-12',
    behaviorChanges: ['Somnolence accrue', "Baisse de l'appetit"],
    clinicalSigns: ['Temperature elevee', 'Toux seche'],
    duration: '2 jours',
    worryLevel: 'Eleve',
    actionsTaken: ['Paracetamol', 'Hydratation reguliere'],
    additionalNotes: 'Pas de vomissements. Vaccinations a jour.',
  },
  {
    id: 'frm-2026-002',
    patientFirstName: 'Noah',
    patientLastName: 'Martin',
    patientIdentifier: 'PAT-00987',
    consultationReason: 'Douleurs abdominales recurrentes',
    submittedAt: '2026-01-26T14:45:00.000Z',
    status: 'in_review',
    childBirthDate: '2019-11-03',
    behaviorChanges: ['Irritabilite', 'Reveils nocturnes'],
    clinicalSigns: ['Ballonnements', "Perte d'appetit"],
    duration: '1 semaine',
    worryLevel: 'Modere',
    actionsTaken: ['Regime leger', 'Observation'],
    additionalNotes: 'Antecedents familiaux de coliques.',
  },
  {
    id: 'frm-2026-003',
    patientFirstName: 'Ines',
    patientLastName: 'Bernard',
    patientIdentifier: 'PAT-00231',
    consultationReason: 'Eruption cutanee apres prise antibiotique',
    submittedAt: '2026-01-24T08:25:00.000Z',
    status: 'completed',
    childBirthDate: '2018-08-19',
    behaviorChanges: [],
    clinicalSigns: ['Rougeurs diffuses', 'Demangeaisons'],
    duration: '24 heures',
    worryLevel: 'Faible',
    actionsTaken: ['Arret antibiotique', 'Creme apaisante'],
    additionalNotes: 'Aucune difficulte respiratoire signalee.',
  },
]

const normalizeText = (value: string) =>
  value
    .toLocaleLowerCase('fr-FR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const matchesSearch = (form: DoctorFormDetail, search: string) => {
  if (!search) return true
  const normalized = normalizeText(search)
  const fields = [
    form.patientFirstName,
    form.patientLastName,
    form.patientIdentifier,
    form.consultationReason,
  ]
  return fields.some((field) => normalizeText(field).includes(normalized))
}

const toSummary = (form: DoctorFormDetail): DoctorFormSummary => ({
  id: form.id,
  patientFirstName: form.patientFirstName,
  patientLastName: form.patientLastName,
  patientIdentifier: form.patientIdentifier,
  consultationReason: form.consultationReason,
  submittedAt: form.submittedAt,
  status: form.status,
})

const getAuthToken = () => localStorage.getItem('authToken')

async function fetchJson<T>(input: RequestInfo, init: RequestInit = {}) {
  const headers = new Headers(init.headers)
  const token = getAuthToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  headers.set('Content-Type', 'application/json')

  const response = await fetch(input, { ...init, headers })
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Erreur HTTP: ${response.status}`)
  }
  return response.json() as Promise<T>
}

export const doctorFormsApi = {
  async list(params: DoctorFormsListParams = {}): Promise<DoctorFormSummary[]> {
    if (USE_MOCKS) {
      const search = params.search?.trim() ?? ''
      return MOCK_FORMS.filter((form) => matchesSearch(form, search)).map(toSummary)
    }

    const url = new URL(`${API_BASE_URL}/doctor/forms`)
    if (params.search) {
      url.searchParams.set('search', params.search)
    }

    const data = await fetchJson<{ items: DoctorFormSummary[] }>(url.toString())
    return data.items
  },

  async get(id: string): Promise<DoctorFormDetail> {
    if (USE_MOCKS) {
      const match = MOCK_FORMS.find((form) => form.id === id)
      if (!match) {
        throw new Error('Formulaire introuvable')
      }
      return match
    }

    return fetchJson<DoctorFormDetail>(`${API_BASE_URL}/doctor/forms/${id}`)
  },
}

export default doctorFormsApi
