<script setup lang="ts">
import { computed } from 'vue'
import { DialogRoot, DialogPortal, DialogOverlay, DialogContent, DialogClose, DialogTitle, DialogDescription } from 'radix-vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

defineProps<Props>()
defineEmits<{
  'update:open': [open: boolean]
}>()
</script>

<template>
  <DialogRoot :open="open" @update:open="$emit('update:open', $event)">
    <slot />
  </DialogRoot>
</template>
