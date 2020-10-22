<template>
  <Suspense>
    <template #default>
      <Header />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script>
import Header from "./../components/chat/Header.vue";
export default {
  components: {
    Header
  }
};
</script>
<style scoped></style>
