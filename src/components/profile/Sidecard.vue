<template>
  <div>
    <div
      class="flex items-center"
      @mouseover="handleMouseOver"
      @mouseleave="handleMouseLeave"
    >
      <img class="w-10 h-10 rounded-full mr-4" :src="profile.image" />
      <div class="text-sm">
        <p class="text-black leading-none">{{ profile.displayName }}</p>
      </div>
    </div>
    <div class="bg-gray-200 rounded pl-1 pr-1" :class="visibleClass">
      <vue3-markdown-it :source="profile.bio" />
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
export default {
  setup() {
    const visibleClass = ref("hidden");
    return { visibleClass };
  },
  methods: {
    handleMouseOver() {
      console.log("Hover enter");
      this.visibleClass = "";
    },
    handleMouseLeave() {
      console.log("hover leave");
      this.visibleClass = "hidden";
    }
  },
  props: ["profile"]
};
</script>
