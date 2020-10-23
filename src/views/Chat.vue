<template>
  <Suspense>
    <template #default>
      <ChatView :selectedThread="selectedThread" />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
<script>
import { inject } from "vue";
import ChatView from "./../components/chat/ChatView";
import * as Constants from "./../constants/LocalStorageConstants.js";
export default {
  setup() {
    const selectedThread = inject("selectedThread");
    console.log("Selected Thread Injected to Chat.vue:", selectedThread);
    return { selectedThread };
  },
  mounted() {
    if (!window.localStorage.getItem(Constants.SEED)) {
      this.$router.push("/");
    }
    console.log("Mouting Chat.vue with thread:", this.selectedThread);
  },
  components: {
    ChatView
  }
};
</script>
<style scoped></style>
