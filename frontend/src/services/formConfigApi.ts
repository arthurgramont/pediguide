import api from '@/services/api'

export type FormFieldKey =
  | 'childFirstName'
  | 'childLastName'
  | 'childBirthDate'
  | 'consultationReason'
  | 'behaviorChanges'
  | 'clinicalSigns'
  | 'duration'
  | 'worryLevel'
  | 'actionsTaken'
  | 'additionalNotes'

export type FormFieldType = 'text' | 'textarea' | 'date' | 'checkbox' | 'radio' | 'select'

export interface FormFieldOption {
  label: string
  value: string
}

export interface FormConfigField {
  key: FormFieldKey
  label: string
  type: FormFieldType
  required: boolean
  order: number
  isActive: boolean
  helpText?: string | null
  options?: FormFieldOption[]
}

export interface FormConfig {
  version: number
  fields: FormConfigField[]
}

export const formFieldStepMap: Record<FormFieldKey, number> = {
  childFirstName: 1,
  childLastName: 1,
  childBirthDate: 1,
  consultationReason: 1,
  behaviorChanges: 2,
  clinicalSigns: 2,
  duration: 3,
  worryLevel: 3,
  actionsTaken: 4,
  additionalNotes: 5,
}

export const defaultFormConfig: FormConfig = {
  version: 1,
  fields: [
    {
      key: 'childFirstName',
      label: "Prénom de l'enfant",
      type: 'text',
      required: true,
      order: 1,
      isActive: true,
    },
    {
      key: 'childLastName',
      label: "Nom de l'enfant",
      type: 'text',
      required: true,
      order: 2,
      isActive: true,
    },
    {
      key: 'childBirthDate',
      label: 'Date de naissance',
      type: 'date',
      required: true,
      order: 3,
      isActive: true,
    },
    {
      key: 'consultationReason',
      label: 'Motif de consultation',
      type: 'textarea',
      required: true,
      order: 4,
      isActive: true,
    },
    {
      key: 'behaviorChanges',
      label: 'Changements de comportement',
      type: 'checkbox',
      required: false,
      order: 1,
      isActive: true,
      helpText: 'Plusieurs choix possibles.',
      options: [
        { label: "Il mange moins que d'habitude", value: "Il mange moins que d'habitude" },
        { label: "Il dort moins ou plus que d'habitude", value: "Il dort moins ou plus que d'habitude" },
        { label: 'Il est plus fatigué', value: 'Il est plus fatigué' },
      ],
    },
    {
      key: 'clinicalSigns',
      label: 'Signes cliniques observés',
      type: 'checkbox',
      required: false,
      order: 2,
      isActive: true,
      helpText: 'Plusieurs choix possibles.',
      options: [
        { label: 'Fièvre', value: 'Fièvre' },
        { label: 'Toux', value: 'Toux' },
        { label: 'Vomissements', value: 'Vomissements' },
      ],
    },
    {
      key: 'duration',
      label: 'Depuis quand ?',
      type: 'radio',
      required: true,
      order: 1,
      isActive: true,
      options: [
        { label: "Aujourd'hui", value: "Aujourd'hui" },
        { label: 'Depuis 1 à 2 jours', value: 'Depuis 1 à 2 jours' },
        { label: 'Depuis plusieurs jours', value: 'Depuis plusieurs jours' },
        { label: "Depuis plus d'une semaine", value: "Depuis plus d'une semaine" },
      ],
    },
    {
      key: 'worryLevel',
      label: "Niveau d'inquiétude",
      type: 'radio',
      required: true,
      order: 2,
      isActive: true,
      options: [
        { label: 'Peu inquiétant', value: 'Peu inquiétant' },
        { label: 'Moyennement inquiétant', value: 'Moyennement inquiétant' },
        { label: 'Très inquiétant', value: 'Très inquiétant' },
      ],
    },
    {
      key: 'actionsTaken',
      label: 'Actions déjà réalisées',
      type: 'checkbox',
      required: false,
      order: 1,
      isActive: true,
      helpText: 'Plusieurs choix possibles.',
      options: [
        { label: "J'ai pris la température", value: "J'ai pris la température" },
        { label: "J'ai donné un médicament", value: "J'ai donné un médicament" },
        { label: "Je n'ai rien fait pour le moment", value: "Je n'ai rien fait pour le moment" },
      ],
    },
    {
      key: 'additionalNotes',
      label: 'Message complémentaire',
      type: 'textarea',
      required: false,
      order: 1,
      isActive: true,
    },
  ],
}

const normalizeConfig = (config?: FormConfig): FormConfig => {
  if (!config || !Array.isArray(config.fields)) {
    return defaultFormConfig
  }

  return {
    version: typeof config.version === 'number' ? config.version : 1,
    fields: config.fields.map((field, index) => ({
      ...field,
      label: field.label?.trim?.() ?? '',
      required: Boolean(field.required),
      order: typeof field.order === 'number' ? field.order : index + 1,
      isActive: field.isActive !== false,
      helpText: field.helpText ?? null,
      options: Array.isArray(field.options) ? field.options : [],
    })),
  }
}

export const formConfigApi = {
  async get(): Promise<FormConfig> {
    const response = (await api.formConfig.get()) as { data?: FormConfig }
    return normalizeConfig(response.data)
  },

  async getDoctor(): Promise<FormConfig> {
    const response = (await api.doctorFormConfig.get()) as { data?: FormConfig }
    return normalizeConfig(response.data)
  },

  async updateDoctor(payload: FormConfig): Promise<FormConfig> {
    const response = (await api.doctorFormConfig.update(payload)) as { data?: FormConfig }
    return normalizeConfig(response.data)
  },
}

export default formConfigApi
