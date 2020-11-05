<template>
  <div>
    <textarea
      v-model="newMessage"
      class="form-textarea w-full mt-6 rounded-md border-indigo-600 bg-gray-100"
      rows="3"
      placeholder="Your message here..."
    />
    <button class="btn btn-secondary float-right" @click.prevent="send">
      <i class="fa fa-paper-plane mr-3"></i>
      {{ buttonText }}
    </button>
  </div>
</template>
<script>
import { inject, ref } from "vue";
import * as PIConstants from "./../../constants/ProvideInjectConstants.js";
export default {
  setup() {
    const sendNewMessage = inject(PIConstants.SEND_NEW_MESSAGE_FUNCTION);
    const updateLoading = inject(PIConstants.UPDATE_LOADING_FUNCTION);
    const newMessage = ref("");
    const buttonText = ref("Send");
    return { newMessage, sendNewMessage, buttonText, updateLoading };
  },
  methods: {
    async send() {
      this.buttonText = "Sending";
      this.updateLoading(true);
      this.sendNewMessage(this.newMessage);
      this.newMessage = "";
      this.buttonText = "Send";
    }
  }
};
</script>
