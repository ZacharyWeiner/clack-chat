<template>
  <div>
    <textarea
      v-model="newMessage"
      class="form-textarea w-full mt-6 rounded-md border-indigo-600 bg-gray-100"
      rows="3"
      placeholder="Your message here..."
    />
    <button
      class="btn btn-secondary float-right"
      @click.prevent="sendMessage(newMessage)"
    >
      <i class="fa fa-paper-plane mr-3"></i>
      {{ buttonText }}
    </button>
  </div>
</template>
<script>
import { inject, ref } from "vue";
import * as Constants from "./../../constants/LocalStorageConstants.js";
import * as PIConstants from "./../../constants/ProvideInjectConstants.js";
export default {
  setup() {
    const newMessage = ref("");
    const buttonText = ref("Send");
    const pk = inject(PIConstants.PUBLIC_KEY);
    const computer = inject(PIConstants.COMPUTER);
    const threadId = inject(PIConstants.SELECTED_THREAD_ID_KEY);
    const updateSelectedThread = inject(
      PIConstants.UPDATE_SELECTED_REV_FUNCTION
    );
    return {
      computer,
      newMessage,
      threadId,
      pk,
      updateSelectedThread,
      buttonText
    };
  },
  methods: {
    async sendMessage(_newMessage) {
      this.buttonText = "Sending...";
      console.log("Sending Message on Thread ID:", this.threadId);
      let _thread = await this.computer.sync(this.threadId);
      let _date = new Date().toString();
      let displayName = window.localStorage.getItem(Constants.DISPLAYNAME);
      console.log("NewMessage: ", this.pk, displayName, _newMessage, _date);
      let asJson = {
        pubKey: this.pk,
        displayName: displayName,
        message: _newMessage,
        date: _date
      };
      await _thread.post(JSON.stringify(asJson));
      console.log(
        "Sent on Synced from ThreadID",
        this.threadId,
        "Thread",
        _thread
      );
      this.updateSelectedThread(_thread._rev);
      this.buttonText = "Send";
      this.newMessage = "";
    }
  }
};
</script>
<style scoped></style>
