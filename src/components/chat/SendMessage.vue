<template>
  <div>
    <input type="textarea" :v-model="newMessage" />
    <button @click.prevent="sendMessage">Send Message</button>
  </div>
</template>
<script>
import { ref } from "vue";
export default {
  setup() {
    const newMessage = ref("");
    return { newMessage };
  },
  methods: {
    async sendMessage() {
      console.log(this.message);
    }
  },
  props: ["thread", "computer"]
};
</script>
<style scoped></style>
