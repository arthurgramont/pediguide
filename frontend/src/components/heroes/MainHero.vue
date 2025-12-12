<script setup lang="ts">
import ImageUtil from '@/components/utils/ImageUtil.vue'
import ContainerUtil from '@/components/utils/ContainerUtil.vue'
import { Button } from '@/components/ui/button'
</script>

<template>
  <ContainerUtil as="section" class="flex items-center justify-center">
    <div class="w-full h-full flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-stretch">
      <div class="w-full flex items-center justify-center">
        <ImageUtil
          image="pediatric-landing-hero"
          alt="Accompagnement pédiatrique"
          widthClass="w-full"
          heightClass="h-full"
          class="object-contain max-h-[50vh] lg:max-h-full"
        />
      </div>

      <div
        class="w-full flex flex-col justify-center items-center lg:items-start text-center lg:text-left gap-6"
      >
        <div>
          <h1
            class="text-display-xl lg:text-display-2xl font-bold tracking-tighter leading-tighter text-text"
          >
            PediGuide
          </h1>
          <h2
            class="text-h2 lg:text-h1 font-semibold tracking-tight leading-snug text-brand"
          >
            Votre application pédiatrique clé en main
          </h2>
        </div>

        <p class="text-body-lg lg:text-h5 leading-relaxed text-text-muted max-w-xl">
          Accompagnez la santé de votre enfant en toute sérénité. PediGuide vous aide à identifier
          les symptômes, suivre l'évolution et obtenir des conseils adaptés pour prendre les bonnes
          décisions au bon moment.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 mt-4">
          <Button size="lg">Commencer mon diagnostic</Button>
          <Button variant="outline" size="lg">Je suis médecin</Button>
        </div>
      </div>
    </div>
  </ContainerUtil>
</template>
