<template>
  <div>
    <div v-for="message in messages" :key="getKeyFromMessage(message)">
      <Message :message="message" />
    </div>
  </div>
</template>
<script>
import { inject, ref } from "vue";
//import Computer from "bitcoin-computer";
import * as PIConstants from "./../../constants/ProvideInjectConstants.js";
import Message from "./Message";
export default {
  setup() {
    const messages = inject(PIConstants.MESSAGES_KEY);
    console.log("messages.value in Messages setup()", messages.value);
    const showNew = ref(false);
    return { messages, showNew };
  },
  components: {
    Message
  },
  computed: {},
  methods: {
    getKeyFromMessage(m) {
      let split = m[1];
      return split || m;
    }
  }
};
</script>
<style scoped></style>
