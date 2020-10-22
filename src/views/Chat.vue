<template>
  <Suspense>
    <template #default>
      <div>
        <Header />
        <Threads :thread="thread_id" />
      </div>
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script>
import { ref } from "vue";
import Header from "./../components/chat/Header.vue";
import Threads from "./../components/chat/Threads.vue";
export default {
  setup() {
    const thread_id = ref("");
    return { thread_id };
  },
  components: {
    Header,
    Threads
  },
  created() {
    console.log("Mounted with Thread ID", this.$route.params.thread_id);
    this.thread_id = this.$route.params.thread_id;
  },
  methods: {
    getID() {
      console.log("Params ID:", this.$route.params.thread_id);
      this.thread_id = this.$route.params.thread_id;
    }
  }
};
</script>
<style scoped></style>
