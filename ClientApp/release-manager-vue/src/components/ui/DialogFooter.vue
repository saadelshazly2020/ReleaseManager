<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>

<template>
  <div :class="cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2')">
    <slot />
  </div>
</template>
