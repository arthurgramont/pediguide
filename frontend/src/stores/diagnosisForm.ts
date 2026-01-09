import { reactive } from 'vue'
import { defineStore } from 'pinia'

export type DiagnosisFormState = {
  childFirstName: string
  childBirthDate: string
  consultationReason: string
  behaviorChanges: string[]
  clinicalSigns: string[]
  duration: string
  worryLevel: string
  actionsTaken: string[]
  additionalNotes: string
}

const createFormState = (): DiagnosisFormState => ({
  childFirstName: '',
  childBirthDate: '',
  consultationReason: '',
  behaviorChanges: [],
  clinicalSigns: [],
  duration: '',
  worryLevel: '',
  actionsTaken: [],
  additionalNotes: '',
})

export const useDiagnosisFormStore = defineStore('diagnosisForm', () => {
  const form = reactive<DiagnosisFormState>(createFormState())

  const reset = () => {
    Object.assign(form, createFormState())
  }

  return { form, reset }
})
