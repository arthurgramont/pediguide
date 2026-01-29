<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Button } from '@/components/ui/button'
import api from '@/services/api'

interface Props {
  kycStatus?: 'verified' | 'rejected' | 'pending'
}

const props = withDefaults(defineProps<Props>(), {
  kycStatus: 'pending',
})

const emit = defineEmits<{
  statusChanged: [status: string]
  refreshRequested: []
}>()

const isLoading = ref(false)
const isRefreshing = ref(false)
const error = ref<string | null>(null)
let pollingInterval: ReturnType<typeof setInterval> | null = null

const statusConfig = {
  verified: {
    text: 'Vérifié',
    class: 'bg-green-100 text-green-800 border-green-200',
    icon: '✓',
  },
  rejected: {
    text: 'Rejeté',
    class: 'bg-red-100 text-red-800 border-red-200',
    icon: '✗',
  },
  pending: {
    text: 'En attente',
    class: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '⏳',
  },
}

/**
 * Request parent component to refresh profile data
 */
function refreshStatus() {
  isRefreshing.value = true
  emit('refreshRequested')
  // Reset refreshing state after a short delay
  setTimeout(() => {
    isRefreshing.value = false
  }, 1000)
}

/**
 * Start auto-polling when status is pending
 */
function startPolling() {
  if (pollingInterval) return // Already polling

  pollingInterval = setInterval(() => {
    console.log('🔄 [KYC] Auto-polling for status update...')
    refreshStatus()
  }, 5000) // Poll every 5 seconds
}

/**
 * Stop auto-polling
 */
function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
    console.log('⏹️ [KYC] Stopped auto-polling')
  }
}

/**
 * Watch for status changes to start/stop polling
 */
watch(() => props.kycStatus, (newStatus) => {
  if (newStatus === 'pending') {
    startPolling()
  } else {
    stopPolling()
  }
})

/**
 * Start polling on mount if status is pending
 */
onMounted(() => {
  console.log('🔄 [KYC] Component mounted, checking if returning from Didit...')
  // Request immediate refresh when component mounts (important when returning from Didit)
  refreshStatus()

  // Start polling if status is pending
  if (props.kycStatus === 'pending') {
    startPolling()
  }
})

/**
 * Clean up polling interval on unmount
 */
onUnmounted(() => {
  stopPolling()
})

async function startVerification() {
  try {
    isLoading.value = true
    error.value = null

    // Call KYC start endpoint (uses authenticated user from JWT token)
    const data = await api.kyc.start() as { redirect_url?: string; url?: string }

    if (data.redirect_url || data.url) {
      // Redirect to Didit verification page
      window.location.href = (data.redirect_url || data.url) as string
    } else {
      throw new Error('No redirect URL received')
    }
  } catch (err: unknown) {
    const errorObj = err as Error;
    console.error('Error starting KYC verification:', errorObj)
    error.value = errorObj.message || 'Une erreur est survenue lors du démarrage de la vérification'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="kyc-verification space-y-4">
    <div class="flex items-center gap-3">
      <h3 class="text-lg font-semibold">Vérification d'identité</h3>
      <span
        :class="[
          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium',
          statusConfig[kycStatus].class,
        ]"
      >
        <span>{{ statusConfig[kycStatus].icon }}</span>
        <span>{{ statusConfig[kycStatus].text }}</span>
      </span>
    </div>

    <div v-if="kycStatus === 'pending'" class="space-y-3">
      <p class="text-sm text-gray-600">
        Pour exercer sur la plateforme, vous devez vérifier votre identité via notre partenaire
        sécurisé Didit.
      </p>

      <div class="flex flex-wrap gap-2">
        <Button
          @click="startVerification"
          :disabled="isLoading"
          class="flex-1 sm:flex-none"
        >
          {{ isLoading ? 'Chargement...' : 'Vérifier mon identité' }}
        </Button>

        <Button
          @click="refreshStatus"
          :disabled="isRefreshing"
          variant="outline"
          class="flex-1 sm:flex-none"
        >
          {{ isRefreshing ? 'Actualisation...' : 'Actualiser le statut' }}
        </Button>
      </div>

      <p class="text-xs text-gray-500">
        Le statut se met à jour automatiquement toutes les 5 secondes
      </p>

      <p v-if="error" class="text-sm text-red-600">
        {{ error }}
      </p>
    </div>

    <div v-else-if="kycStatus === 'verified'" class="space-y-2">
      <p class="text-sm text-green-700">
        Votre identité a été vérifiée avec succès. Vous pouvez maintenant accéder à toutes les
        fonctionnalités de la plateforme.
      </p>
    </div>

    <div v-else-if="kycStatus === 'rejected'" class="space-y-2">
      <p class="text-sm text-red-700">
        La vérification de votre identité a été rejetée. Veuillez contacter le support pour plus
        d'informations.
      </p>
      <Button
        @click="startVerification"
        :disabled="isLoading"
        variant="outline"
        class="w-full sm:w-auto"
      >
        {{ isLoading ? 'Chargement...' : 'Réessayer la vérification' }}
      </Button>
    </div>
  </div>
</template>
