<script setup>
import { ref } from "vue"

const valueImplementationBest = ref(0)
const valueImplementationWorst = ref(0)
const valueRiskPercent = ref(50)
const valueCodeReview = ref("0")
const valueDocumentation = ref("0")
const valueResult = ref(0)
const errorMessage = ref("")

function handleInput(e, model) {
  let value = e.target.value.replace(",", ".")

  const isValid = /^(|0|[1-9]\d*)(\.\d{0,2})?$/.test(value)

  if (!isValid) {
    e.target.value = model.value
    return
  }

  model.value = value
}

function onInputValueImplementation(e) {
  handleInput(e, valueImplementationBest)
}

function onInputValueImplementationWorst(e) {
  handleInput(e, valueImplementationWorst)
}

function onInputCodeReview(e) {
  handleInput(e, valueCodeReview)
}

function onInputDocumentation(e) {
  handleInput(e, valueDocumentation)
}

function onSliderInput(e) {
  valueRiskPercent.value = Number(e.target.value)
}

function onCalculate() {
  const implementationBest = Number(valueImplementationBest.value || 0)
  const implementationWorst = Number(valueImplementationWorst.value || 0)
  const review = Number(valueCodeReview.value || 0)
  const docs = Number(valueDocumentation.value || 0)
  const risk = Math.min(Math.max(valueRiskPercent.value, 0), 100) / 100

  if (implementationWorst < implementationBest) {
    errorMessage.value = "Worst case must be greater than or equal to best case."
    valueResult.value = ""
    return
  }

  errorMessage.value = ""

  const implementationEstimate =
    implementationBest + (implementationWorst - implementationBest) * risk

  const base = implementationEstimate + review + docs

  valueResult.value = Math.ceil(base / 0.25) * 0.25
}

</script>

<template>
<section class="card">
  <h2>Effort Cost Calculator</h2>

  <div class="form-row">
    <div class="form-group">
      <label for="hours-best">Implementation Best Case (PT's)</label>
      <input
        id="hours-best"
        :value="valueImplementationBest"
        @input="onInputValueImplementation"
        placeholder="e.g. 3"
      />
    </div>

    <div class="form-group">
      <label for="hours-worst">Implementation Worst Case (PT's)</label>
      <input
        id="hours-worst"
        :value="valueImplementationWorst"
        @input="onInputValueImplementationWorst"
        placeholder="e.g. 6"
      />
    </div>
  </div>

  <div class="form-group">
    <label for="factor">Worst-Case Risk</label>
    <div class="slider-field">
      <input
        id="factor"
        type="range"
        min="0"
        max="100"
        step="25"
        :value="valueRiskPercent"
        @input="onSliderInput"
      />
      <div class="slider-ticks">
        <span>0%<br>Best case likely</span>
        <span>50%<br>Balanced</span>
        <span>100%<br>Worst case likely</span>
      </div>
    </div>
    <div class="slider-value">Risk: {{ valueRiskPercent }}%</div>
  </div>

  <div class="form-group">
    <label for="code-review">Code Review PT's</label>
    <input
      id="code-review"
      :value="valueCodeReview"
      @input="onInputCodeReview"
      placeholder="e.g. 0.5"
    />
  </div>

  <div class="form-group">
    <label for="documentation">Documentation PT's</label>
    <input
      id="documentation"
      :value="valueDocumentation"
      @input="onInputDocumentation"
      placeholder="e.g. 1.0"
    />
  </div>

  <div class="row">
    <button @click="onCalculate">Calculate</button>
  </div>

  <div class="alert" v-if="errorMessage">
    <span class="alert-icon">!</span>
    <span class="alert-message">{{ errorMessage }}</span>
  </div>

  <div class="row" v-else>
    <b>Schätzung in PT's: {{ valueResult }} </b>
  </div>
</section>
</template>




