<script setup lang="ts">
import { onMounted, ref } from "vue";

import { getRandomQuote } from "@/features/quotes/api/quoteApi";
import { isApiError, normalizeApiError } from "@/lib/api/httpClient";
import { useCounterStore } from "@/stores/counter";

const counter = useCounterStore();
const quoteText = ref<string>("Loading quote...");
const quoteAuthor = ref<string>("");

async function loadQuote() {
  try {
    const data = await getRandomQuote();
    const quote = data[0];
    quoteText.value = quote ? quote.q : "No quote found.";
    quoteAuthor.value = quote?.a ?? "";
  } catch (error) {
    const apiError = isApiError(error) ? error : normalizeApiError(error);
    quoteText.value = apiError.status
      ? `API error (${apiError.status}): ${apiError.message}`
      : "Quote API unreachable. Please try again later.";
    quoteAuthor.value = "";
  }
}

onMounted(() => {
  void loadQuote();
});
</script>

<template>
  <section class="card">
    <h2>Hello World</h2>
    <p>This is a minimal Vue frontend with router, Pinia, and a REST API layer.</p>

    <div class="row">
      <button type="button" @click="counter.increment">Count: {{ counter.count }}</button>
      <span>Doubled: {{ counter.doubled }}</span>
    </div>

    <div class="quote-box">
      <p class="quote-text">"{{ quoteText }}"</p>
      <p v-if="quoteAuthor" class="quote-author">- {{ quoteAuthor }}</p>
    </div>
  </section>
</template>

<style scoped>
.quote-box {
  margin-top: 1rem;
  padding: 0.9rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.quote-text {
  margin: 0;
  line-height: 1.5;
  color: #0f172a;
}

.quote-author {
  margin: 0.55rem 0 0;
  color: #475569;
  font-weight: 600;
}
</style>
