<template>
  <Suspense>
    <template #default>
      <ChatView />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
<script>
import ChatView from "./../components/chat/ChatView";
import * as Constants from "./../constants/LocalStorageConstants.js";
export default {
  mounted() {
    if (!window.localStorage.getItem(Constants.SEED)) {
      this.$router.push("/");
    }
  },
  components: {
    ChatView
  }
};
</script>
<style scoped></style>
