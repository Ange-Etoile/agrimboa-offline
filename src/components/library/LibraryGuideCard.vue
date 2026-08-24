<script setup lang="ts">
import { Bookmark, Clock3 } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import type { LibraryGuide } from "@/features/library/types/library";
import LibraryGuideImage from "./LibraryGuideImage.vue";
defineProps<{guide:LibraryGuide}>(); defineEmits<{open:[];bookmark:[]}>(); const {t}=useI18n();
</script>
<template><article class="guide-card" @click="$emit('open')"><LibraryGuideImage :image-key="guide.imageKey" :alt="guide.title"/><div><span class="tag">{{t(`library.categories.${guide.category}`)}}</span><h3>{{guide.title}}</h3><p>{{guide.summary}}</p><footer><span><Clock3/>{{guide.readingMinutes}} {{t('library.minutes')}}</span><button :class="{saved:guide.bookmarked}" :aria-label="t('library.save')" @click.stop="$emit('bookmark')"><Bookmark/></button></footer></div></article></template>
<style scoped>.guide-card{cursor:pointer;overflow:hidden;border:1px solid #dfe7e1;border-radius:14px;background:#fff;box-shadow:0 8px 22px #173d1c0b}.guide-card>img{width:100%;height:152px;object-fit:cover}.guide-card>div{padding:16px}.tag{font-size:10px;font-weight:800;text-transform:uppercase;color:#08752c}.guide-card h3{margin-top:7px;font-size:16px;font-weight:800;line-height:1.3}.guide-card p{display:-webkit-box;overflow:hidden;margin-top:8px;color:#617087;font-size:12px;line-height:1.55;-webkit-line-clamp:2;-webkit-box-orient:vertical}.guide-card footer{display:flex;align-items:center;justify-content:space-between;margin-top:13px;color:#6a788c;font-size:11px}.guide-card footer span{display:flex;align-items:center;gap:6px}.guide-card svg{width:16px}.guide-card button{display:grid;width:34px;height:34px;place-items:center;border:1px solid #dfe5e0;border-radius:8px}.guide-card button.saved{background:#eaf6ec;color:#08752c}</style>

