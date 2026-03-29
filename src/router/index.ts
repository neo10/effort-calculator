import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import EffortCalculatorView from "@/views/EffortCalculator.vue";
import HomeView from "@/views/HomeView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/effort-calc",
    name: "effortCalc",
    component: EffortCalculatorView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
