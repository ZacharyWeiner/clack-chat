<template>
  <div>
     <div class="flex items-center">
      <img class="w-10 h-10 rounded-full mr-4" :src="profile.image">
      <div class="text-sm">
        <p class="text-black leading-none">{{ profile.displayName }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["profile"]
};
</script>
