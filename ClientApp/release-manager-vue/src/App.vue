<script setup lang="ts">
import { RouterView } from 'vue-router'
import Layout from '@/components/Layout.vue'
</script>

<template>
  <Layout>
    <RouterView />
  </Layout>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
