import type { DiagnosisFormState } from '@/stores/diagnosisForm'

export type FormFieldKey = keyof DiagnosisFormState

const normalizeText = (value: string) => value.trim()

const validateBirthDate = (value: string) => {
  if (!value) {
    return 'La date de naissance est requise.'
  }

  const parsedDate = new Date(`${value}T00:00:00`)
  if (Number.isNaN(parsedDate.getTime())) {
    return 'La date de naissance est invalide.'
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (parsedDate > today) {
    return 'La date de naissance ne peut pas être dans le futur.'
  }

  return null
}

export const validators: Record<FormFieldKey, (value: DiagnosisFormState[FormFieldKey]) => string | null> = {
  childFirstName: (value) => {
    const trimmed = normalizeText(String(value))
    return trimmed ? null : "Le prénom de l'enfant est requis."
  },
  childLastName: (value) => {
    const trimmed = normalizeText(String(value))
    return trimmed ? null : "Le nom de l'enfant est requis."
  },
  childBirthDate: (value) => validateBirthDate(String(value)),
  consultationReason: (value) => {
    const trimmed = normalizeText(String(value))
    if (!trimmed) {
      return 'Le motif de consultation est requis.'
    }
    return trimmed.length < 5
      ? 'Merci de préciser le motif (au moins 5 caractères).'
      : null
  },
  behaviorChanges: () => null,
  clinicalSigns: () => null,
  duration: (value) => (String(value) ? null : 'Merci de sélectionner une durée.'),
  worryLevel: (value) => (String(value) ? null : "Merci d'indiquer votre niveau d'inquiétude."),
  actionsTaken: () => null,
  additionalNotes: () => null,
  consent: (value) => (value ? null : "Merci de donner votre consentement avant l'envoi."),
}

export const fieldIds: Record<FormFieldKey, string> = {
  childFirstName: 'child-first-name',
  childLastName: 'child-last-name',
  childBirthDate: 'child-birth-date',
  consultationReason: 'consultation-reason',
  behaviorChanges: 'behavior-changes',
  clinicalSigns: 'clinical-signs',
  duration: 'duration',
  worryLevel: 'worry-level',
  actionsTaken: 'actions-taken',
  additionalNotes: 'additional-notes',
  consent: 'consent-checkbox',
}

export const errorId = (field: FormFieldKey) => `${fieldIds[field]}-error`
