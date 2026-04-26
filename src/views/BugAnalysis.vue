<script setup lang="ts">
import { computed, ref } from "vue";

const copied = ref(false);

const checklistTemplate = `==================== BUGFIX ====================

PROBLEM
-----------------------------------------------
Actual (was passiert?):
> 

Expected (was sollte passieren?):
> 

Where / Context (wo sichtbar?):
> 


TEST CASE
-----------------------------------------------
Repro steps:
1. 
2. 
3. 

Input / Data:
> 

Result:
> 

Expected:
> 

(If no test case: try to recreate minimal scenario)


SYMPTOM (IM CODE)
-----------------------------------------------
Where in code does it break?
> 

What exactly goes wrong there?
> 


CAUSE (WHY?)
-----------------------------------------------
Hypotheses:
- H1: 
- H2: 
- H3: 

Test & findings:
> 

Final root cause:
> 


FIX
-----------------------------------------------
What will I change?
> 

Why does this fix it?
> 


VALIDATION
-----------------------------------------------
Test case works? (yes/no)
> 

Other cases checked:
> 


NOTES / IDEAS
-----------------------------------------------
> 

================================================
`;

const copyButtonLabel = computed(() =>
  copied.value ? "Kopiert" : "Template kopieren",
);

async function copyTemplate() {
  try {
    await navigator.clipboard.writeText(checklistTemplate);
    copied.value = true;
    window.setTimeout(() => {
      copied.value = false;
    }, 1800);
  } catch {
    copied.value = false;
  }
}

function selectTemplate(event: FocusEvent) {
  if (event.target instanceof HTMLTextAreaElement) {
    event.target.select();
  }
}
</script>

<template>
  <section class="bug-analysis">
<div class="intro-panel">
  <p class="eyebrow">Hypothesen-Driven Debugging</p>
  <h2>Strukturiert debuggen ohne Kontextverlust</h2>
  <p>
    Ziel ist nicht, alles im Kopf zu behalten, sondern strukturiert vorzugehen:
    Erst einen reproduzierbaren Test Case schaffen, dann das Symptom im Code
    lokalisieren, die Ursache systematisch über Hypothesen finden und sauber
    verifizieren. Jede Idee wird sofort notiert, aber immer nur eine Hypothese
    gleichzeitig geprüft.
  </p>
</div>

    <div class="copy-panel">
      <div class="copy-header">
        <div>
          <p class="eyebrow">Copy-Paste Box</p>
          <h3>Vorlage fuer deine Bug-Analyse</h3>
        </div>
        <button type="button" class="copy-button" @click="copyTemplate">
          {{ copyButtonLabel }}
        </button>
      </div>

      <textarea
        class="template-textarea"
        readonly
        :value="checklistTemplate"
        aria-label="Bug Debugging Template"
        @focus="selectTemplate"
      />
    </div>
  </section>
</template>

<style scoped>
.bug-analysis {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.intro-panel,
.workflow-panel,
.copy-panel,
.info-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 5px 25px rgba(15, 23, 42, 0.08);
}

.intro-panel {
  padding: 1.2rem;
  border-left: 5px solid #0ea5e9;
}

.intro-panel h2,
.workflow-panel h3,
.copy-panel h3,
.info-card h3 {
  margin: 0;
  color: #0f172a;
}

.intro-panel h2 {
  font-size: clamp(1.55rem, 4vw, 2.1rem);
}

.intro-panel p:last-child,
.info-card p {
  margin-bottom: 0;
}

.eyebrow {
  margin: 0 0 0.35rem;
  color: #0369a1;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.info-card {
  padding: 1rem;
}

.info-card.highlight {
  border-color: #bae6fd;
  background: #f0f9ff;
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 0.8rem;
  font-weight: 800;
}

.info-card p,
.intro-panel p,
.workflow-panel li {
  color: #334155;
  line-height: 1.6;
}

.workflow-panel,
.copy-panel {
  padding: 1rem;
}

.workflow-panel ol {
  margin: 0.75rem 0 0;
  padding-left: 1.25rem;
}

.workflow-panel li + li {
  margin-top: 0.4rem;
}

.copy-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.8rem;
}

.copy-button {
  flex: 0 0 auto;
  border-radius: 8px;
  background: #0f172a;
  font-weight: 700;
}

.copy-button:focus {
  outline: 3px solid #bae6fd;
  outline-offset: 2px;
}

.template-textarea {
  width: 100%;
  min-height: 560px;
  padding: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #f8fafc;
  color: #0f172a;
  font-family: Consolas, "Courier New", monospace;
  font-size: 0.9rem;
  line-height: 1.55;
  resize: vertical;
  white-space: pre;
}

.template-textarea:focus {
  border-color: #0ea5e9;
  outline: 3px solid #bae6fd;
}

@media (max-width: 700px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .copy-header {
    align-items: stretch;
    flex-direction: column;
  }

  .copy-button {
    width: 100%;
  }
}
</style>
