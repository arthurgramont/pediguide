<script setup lang="ts">
interface Props {
  icon: string
  widthClass?: string
  heightClass?: string
  colorClass?: string
}

const {
  icon,
  widthClass = 'w-14',
  heightClass = 'h-14',
  colorClass = 'text-foreground',
} = defineProps<Props>()

const icons = import.meta.glob<{ default: string }>('../../assets/icons/*.svg', {
  query: '?raw',
  eager: true,
})

const importedIcon = () => {
  const iconPath = `../../assets/icons/${icon}.svg`
  const svgContent = icons[iconPath]?.default
  if (!svgContent) {
    console.warn('No icons found for: ', iconPath)
    return ''
  }
  return svgContent.replace('<svg', '<svg style="width: 100%; height: 100%"')
}
</script>

<template>
  <span
    :class="[widthClass, heightClass, colorClass]"
    class="inline-block"
    v-html="importedIcon()"
  />
</template>
