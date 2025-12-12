<script setup lang="ts">
interface Props {
  logo: string
  widthClass?: string
  heightClass?: string
  colorClass?: string
}

const {
  logo,
  widthClass = 'w-14',
  heightClass = 'h-14',
  colorClass = 'text-foreground',
} = defineProps<Props>()

const icons = import.meta.glob<{ default: string }>('../../assets/*.svg', {
  query: '?raw',
  eager: true,
})

const importedLogo = () => {
  const logoPath = `../../assets/${logo}.svg`
  const logoContent = icons[logoPath]?.default
  if (!logoContent) {
    console.warn('No logo found for: ', logoPath)
    return ''
  }
  return logoContent.replace('<svg', '<svg style="width: 100%; height: 100%"')
}
</script>

<template>
  <span
    :class="[widthClass, heightClass, colorClass]"
    class="inline-block"
    v-html="importedLogo()"
  />
</template>
