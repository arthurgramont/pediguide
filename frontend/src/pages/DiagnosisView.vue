<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const step = ref(1) // Étape actuelle (1 à 5)
const isLoading = ref(false)
const errorMessage = ref('')

// Les données exactes attendues par ton Backend
const form = reactive({
  childFirstName: '',
  childBirthDate: '',
  consultationReason: '',
  behaviorChanges: [] as string[],
  clinicalSigns: [] as string[],
  duration: '',
  worryLevel: '',
  actionsTaken: [] as string[],
  additionalNotes: ''
})

// Navigation
const nextStep = () => { if (step.value < 5) step.value++ }
const prevStep = () => { if (step.value > 1) step.value-- }

// Envoi final
const submitForm = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    // Adapter l'URL si tu es en local ou sur Vercel
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    
    const res = await fetch(`${apiUrl}/api/diagnosis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.error || 'Erreur inconnue')

    // Succès : On redirige vers une page de succès (ou alerte pour l'instant)
    alert('Dossier envoyé au médecin avec succès !')
    router.push('/') 

  } catch (error) {
    console.error(error)
    errorMessage.value = "Une erreur est survenue lors de l'envoi."
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 bg-white min-h-screen">
    
    <div class="mb-8">
      <h2 class="text-blue-600 font-semibold mb-2">Étape {{ step }} sur 5</h2>
      <div class="h-2 w-full bg-blue-100 rounded-full">
        <div class="h-full bg-blue-600 rounded-full transition-all duration-300" :style="{ width: `${(step/5)*100}%` }"></div>
      </div>
    </div>

    <form @submit.prevent="submitForm" class="space-y-6">

      <div v-if="step === 1" class="space-y-4">
        <h1 class="text-xl font-bold text-blue-900">Préparer la consultation de votre enfant</h1>
        
        <div>
          <label class="block text-sm font-medium mb-1">Prénom de l'enfant *</label>
          <input v-model="form.childFirstName" type="text" required class="w-full border rounded-lg p-3" placeholder="Ex: Arthur" />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Date de naissance *</label>
          <input v-model="form.childBirthDate" type="date" required class="w-full border rounded-lg p-3" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Qu'est-ce qui vous amène ? *</label>
          <textarea v-model="form.consultationReason" required rows="3" class="w-full border rounded-lg p-3" placeholder="Ex: Fièvre depuis 2 jours..."></textarea>
        </div>
      </div>

      <div v-if="step === 2" class="space-y-6">
        <h1 class="text-xl font-bold text-blue-900">Ce que vous observez</h1>
        
        <div>
          <p class="font-medium mb-3">Avez-vous remarqué un changement ?</p>
          <div class="space-y-2">
            <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" value="Il mange moins que d'habitude" v-model="form.behaviorChanges" class="w-5 h-5 text-blue-600" />
              <span>Il mange moins que d'habitude</span>
            </label>
            <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" value="Il dort moins ou plus que d'habitude" v-model="form.behaviorChanges" class="w-5 h-5 text-blue-600" />
              <span>Il dort moins ou plus que d'habitude</span>
            </label>
            <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" value="Il est plus fatigué" v-model="form.behaviorChanges" class="w-5 h-5 text-blue-600" />
              <span>Il est plus fatigué</span>
            </label>
          </div>
        </div>

        <div>
          <p class="font-medium mb-3">Avez-vous observé ces signes ?</p>
          <div class="space-y-2">
            <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" value="Fièvre" v-model="form.clinicalSigns" class="w-5 h-5 text-blue-600" />
              <span>Fièvre</span>
            </label>
            <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" value="Toux" v-model="form.clinicalSigns" class="w-5 h-5 text-blue-600" />
              <span>Toux</span>
            </label>
            <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" value="Vomissements" v-model="form.clinicalSigns" class="w-5 h-5 text-blue-600" />
              <span>Vomissements</span>
            </label>
          </div>
        </div>
      </div>

      <div v-if="step === 3" class="space-y-6">
        <h1 class="text-xl font-bold text-blue-900">Depuis quand et ressenti</h1>
        
        <div>
          <p class="font-medium mb-3">Depuis quand ? *</p>
          <div class="space-y-2">
            <label v-for="duree in ['Aujourd\'hui', 'Depuis 1 à 2 jours', 'Depuis plusieurs jours', 'Depuis plus d\'une semaine']" :key="duree" class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
              <input type="radio" :value="duree" v-model="form.duration" class="w-5 h-5 text-blue-600" />
              <span>{{ duree }}</span>
            </label>
          </div>
        </div>

        <div>
          <p class="font-medium mb-3">Niveau d'inquiétude *</p>
          <div class="space-y-2">
            <label v-for="level in ['Peu inquiétant', 'Moyennement inquiétant', 'Très inquiétant']" :key="level" class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
              <input type="radio" :value="level" v-model="form.worryLevel" class="w-5 h-5 text-blue-600" />
              <span>{{ level }}</span>
            </label>
          </div>
        </div>
      </div>

      <div v-if="step === 4" class="space-y-6">
        <h1 class="text-xl font-bold text-blue-900">Ce que vous avez déjà fait</h1>
        <div class="space-y-2">
            <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" value="J'ai pris la température" v-model="form.actionsTaken" class="w-5 h-5 text-blue-600" />
              <span>J'ai pris la température</span>
            </label>
            <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" value="J'ai donné un médicament" v-model="form.actionsTaken" class="w-5 h-5 text-blue-600" />
              <span>J'ai donné un médicament</span>
            </label>
            <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" value="Rien pour le moment" v-model="form.actionsTaken" class="w-5 h-5 text-blue-600" />
              <span>Je n'ai rien fait pour le moment</span>
            </label>
        </div>
      </div>

      <div v-if="step === 5" class="space-y-4">
        <h1 class="text-xl font-bold text-blue-900">Message libre</h1>
        <p>Souhaitez-vous ajouter autre chose pour le médecin ?</p>
        <textarea v-model="form.additionalNotes" rows="5" class="w-full border rounded-lg p-3" placeholder="Vous pouvez partager ici tout ce qui vous semble important..."></textarea>
      </div>

      <div class="flex justify-between pt-6 border-t mt-6">
        <button 
          v-if="step > 1" 
          type="button" 
          @click="prevStep" 
          class="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium"
        >
          Retour
        </button>
        <div v-else></div> <button 
          v-if="step < 5" 
          type="button" 
          @click="nextStep"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          Continuer
        </button>

        <button 
          v-if="step === 5" 
          type="submit"
          :disabled="isLoading" 
          class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {{ isLoading ? 'Envoi...' : 'Envoyer mes réponses' }}
        </button>
      </div>

      <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>

    </form>
  </div>
</template>