<script setup lang="ts">
import { CircleHelp, Leaf, ListChecks, TrendingUp } from "lucide-vue-next";
defineProps<{ active: string }>();
const emit = defineEmits<{ select: [section: string] }>();
const tabs = [{ id: "overview", label: "Vue d’ensemble", icon: Leaf }, { id: "action", label: "Plan d’action", icon: ListChecks }, { id: "why", label: "Pourquoi ce résultat ?", icon: CircleHelp }, { id: "followup", label: "Suivi", icon: TrendingUp }];
</script>
<template><nav class="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4"><button v-for="tab in tabs" :key="tab.id" class="tab" :class="{ active: active === tab.id }" @click="emit('select', tab.id)"><component :is="tab.icon" class="size-4" />{{ tab.label }}</button></nav></template>
