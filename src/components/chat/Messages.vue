<template>
  <div class="flex flex-col-reverse">
    <div v-for="message in messages" :key="getKeyFromMessage(message)" >
      <Message :message="message" />
    </div>
  </div>
</template>
<script>
import { inject, provide, ref } from "vue";
//import Computer from "bitcoin-computer";
import * as PIConstants from "./../../constants/ProvideInjectConstants.js";
import Message from "./Message";
export default {
  setup() {
    const messages = inject(PIConstants.MESSAGES_KEY);
    const profiles = inject(PIConstants.PROFILE_LIST_KEY);
    console.log("messages.value in Messages setup()", messages.value);
    const showNew = ref(false);
    provide(PIConstants.PROFILE_LIST_KEY, profiles);
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
