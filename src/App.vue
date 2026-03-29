<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="layout">
    <header>
      <h1>Philipp's Tools</h1>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/effort-calc">Aufwandsschätzer</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>
