<script setup lang="ts">
import { ref } from "vue";

import { getHealth } from "@/features/health/api/healthApi";
import type { ApiError } from "@/lib/api/httpClient";
import { useCounterStore } from "@/stores/counter";

const counter = useCounterStore();
const apiMessage = ref<string>("Not loaded yet");

async function loadHealth() {
  try {
    const data = await getHealth();
    apiMessage.value = JSON.stringify(data);
  } catch (error) {
    const apiError = error as ApiError;
    apiMessage.value = apiError.status
      ? `API error (${apiError.status}): ${apiError.message}`
      : "Backend unreachable. Update VITE_API_BASE_URL in your .env file.";
  }
}
</script>

<template>
  <section class="card">
    <h2>Hello World</h2>
    <p>This is a minimal Vue frontend with router, Pinia, and a REST API layer.</p>

    <div class="row">
      <button type="button" @click="counter.increment">Count: {{ counter.count }}</button>
      <span>Doubled: {{ counter.doubled }}</span>
    </div>

    <div class="row">
      <button type="button" @click="loadHealth">GET /health</button>
      <code>{{ apiMessage }}</code>
    </div>
  </section>
</template>
