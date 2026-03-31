<script setup>
import { ref, computed } from "vue"

// --- State ---
const valueTopic = ref("")
const valueAssumptions = ref("")
const valueImplementationBest = ref(1)
const valueImplementationMostLikely = ref(2)
const valueImplementationWorst = ref(3)
const valueCodeReview = ref(0.5)
const valueDocumentation = ref(0.5)

// --- Input Handling ---
function handleInput(e, model) {
  let value = e.target.value.replace(",", ".")

  const isValid = /^(\d+([.]\d{0,2})?)?$/.test(value)

  if (!isValid) {
    e.target.value = model.value
    return
  }

  model.value = value === "" ? 0 : Number(value)
}

function createInputHandler(model) {
  return (e) => handleInput(e, model)
}

const onInputBest = createInputHandler(valueImplementationBest)
const onInputMostLikely = createInputHandler(valueImplementationMostLikely)
const onInputWorst = createInputHandler(valueImplementationWorst)
const onInputReview = createInputHandler(valueCodeReview)
const onInputDocs = createInputHandler(valueDocumentation)

// --- Utils ---
function roundToQuarter(value) {
  return Math.round(value * 4) / 4
}

function formatPt(value) {
  return Number(value.toFixed(2)).toString().replace(".", ",")
}

function formatDate(date) {
  return new Intl.DateTimeFormat("de-DE").format(date)
}

// --- Error Handling (clean & reactive) ---
const errorMessage = computed(() => {
  if (valueImplementationWorst.value < valueImplementationBest.value) {
    return "Worst case must be greater than or equal to best case."
  }
  if (valueImplementationMostLikely.value < valueImplementationBest.value) {
    return "Most likely must be greater than or equal to best case."
  }
  if (valueImplementationMostLikely.value > valueImplementationWorst.value) {
    return "Most likely must be smaller than or equal to worst case."
  }
  return ""
})


// --- Calculation (PURE computed) ---
const result = computed(() => {
  if (errorMessage.value) return null

  const best = valueImplementationBest.value
  const mostLikely = valueImplementationMostLikely.value
  const worst = valueImplementationWorst.value
  const review = valueCodeReview.value
  const docs = valueDocumentation.value

  // PERT Formel
  const implementationEstimate =
    (best + 4 * mostLikely + worst) / 6

  const base = implementationEstimate + review + docs

  return {
    implementation: roundToQuarter(implementationEstimate),
    review,
    docs,
    total: roundToQuarter(base)
  }
})

const businessSummary = computed(() => {
  if (!result.value) return ""

  const topic = valueTopic.value.trim() || "Allgemeine Anforderung"
  const assumptions = valueAssumptions.value.trim()
  const today = formatDate(new Date())
  const bestTotal = roundToQuarter(
    valueImplementationBest.value + valueCodeReview.value + valueDocumentation.value
  )
  const worstTotal = roundToQuarter(
    valueImplementationWorst.value + valueCodeReview.value + valueDocumentation.value
  )
  const summaryLines = [
    `Schaetzung fuer: ${topic}`,
    `Datum: ${today}`,
    "",
    `Erwartungswert (PERT): ${formatPt(result.value.total)} PT`,
    `Bandbreite (Bestcase - Worstcase): ${formatPt(bestTotal)} PT - ${formatPt(worstTotal)} PT`
  ]

  if (assumptions) {
    summaryLines.push("Annahmen/Abhaengigkeiten:", assumptions)
  }

  const includedParts = []

  if (result.value.implementation > 0) {
    includedParts.push("Implementation")
  }

  if (valueCodeReview.value > 0) {
    includedParts.push("Code Review")
  }

  if (valueDocumentation.value > 0) {
    includedParts.push("Dokumentation")
  }

  if (includedParts.length > 0) {
    summaryLines.push("", `Enthalten: ${includedParts.join(", ")}`)
  }

  return summaryLines.join("\n")
})
</script>

<template>
<section class="card">
  <h2>Aufwandsschätzer</h2>

  <div class="form-group">
    <label>Thema/Anforderung</label>
    <input
      v-model="valueTopic"
      placeholder="z.B. Angebotserstellung mit PDF Export"
    />
  </div>

  <div class="form-group">
    <label>Annahmen/Abhaengigkeiten</label>
    <textarea
      v-model="valueAssumptions"
      class="assumptions-textarea"
      placeholder="z.B. API vorhanden, keine UX-Neuentwicklung"
    />
  </div>

  <div class="form-row">
    <div class="form-group">
      <label>Implementation Optimistic (PT)</label>
      <input
        :value="valueImplementationBest"
        @input="onInputBest"
        placeholder="e.g. 3"
      />
    </div>

    <div class="form-group">
      <label>Implementation Most likely (PT)</label>
      <input
        :value="valueImplementationMostLikely"
        @input="onInputMostLikely"
        placeholder="e.g. 4"
      />
    </div>

    <div class="form-group">
      <label>Implementation Pessimistic (PT)</label>
      <input
        :value="valueImplementationWorst"
        @input="onInputWorst"
        placeholder="e.g. 6"
      />
    </div>
  </div>

  <div class="form-group">
    <label>Code Review (PT)</label>
    <input
      :value="valueCodeReview"
      @input="onInputReview"
      placeholder="e.g. 0.5"
    />
  </div>

  <div class="form-group">
    <label>Documentation (PT)</label>
    <input
      :value="valueDocumentation"
      @input="onInputDocs"
      placeholder="e.g. 1.0"
    />
  </div>

  <!-- Error -->
  <div class="alert" v-if="errorMessage">
    <span class="alert-icon">!</span>
    <span class="alert-message">{{ errorMessage }}</span>
  </div>
  <!-- Result -->
<div class="result-grid" v-if="!errorMessage">
  <span class="label">Implementation:</span>
  <span class="value">{{ result.implementation }} PT</span>

  <span class="label">Code Review:</span>
  <span class="value">{{ result.review }} PT</span>

  <span class="label">Documentation:</span>
  <span class="value">{{ result.docs }} PT</span>

  <span class="label"><b>Schaetzung:</b></span>
  <span class="value"><b>{{ result.total }} PT</b></span>
</div>

<div class="copy-box" v-if="!errorMessage">
  <label for="business-summary">Zusammenfassung</label>
  <textarea
    id="business-summary"
    class="copy-textarea"
    readonly
    :value="businessSummary"
    @focus="$event.target.select()"
  />
</div>
</section>
</template>

<style scoped>
.result-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 8px;
  row-gap: 4px;
  margin-top: 12px;
}

.result-grid .label {
  grid-column: 1; 
}

.result-grid .value {
  grid-column: 2; 
  text-align: left;
}

.copy-box {
  margin-top: 16px;
}

.assumptions-textarea {
  width: 100%;
  min-height: 74px;
  padding: 10px 12px;
  border: 1px solid #cfd5e3;
  border-radius: 8px;
  resize: vertical;
  line-height: 1.4;
}

.copy-textarea {
  width: 100%;
  min-height: 190px;
  margin-top: 8px;
  border: 1px solid #cfd5e3;
  border-radius: 10px;
  background: #f8fafc;
  padding: 12px;
  resize: vertical;
  line-height: 1.5;
  white-space: pre;
  font-family: Consolas, "Courier New", monospace;
}

.copy-textarea:focus {
  outline: 2px solid #93c5fd;
  border-color: #93c5fd;
}
</style>
