<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
  modelValue?: string | number;
  class?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<template>
  <input
    :value="modelValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="cn(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      props.class
    )"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
