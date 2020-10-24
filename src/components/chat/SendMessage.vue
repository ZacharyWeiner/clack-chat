<template>
  <div>
    <input type="textarea" v-model="newMessage" />
    <button @click.prevent="sendMessage(newMessage)">Send Message</button>
  </div>
</template>
<script>
import { inject, ref } from "vue";
import * as Constants from "./../../constants/LocalStorageConstants.js";
import * as PIConstants from "./../../constants/ProvideInjectConstants.js";
export default {
  setup() {
    const newMessage = ref("");
    const pk = inject(PIConstants.PUBLIC_KEY);
    const computer = inject(PIConstants.COMPUTER);
    const threadId = inject(PIConstants.SELECTED_THREAD_ID_KEY);
    const updateSelectedThread = inject(PIConstants.UPDATE_SELECTED_REV_FUNCTION);
    return { computer, newMessage, threadId, pk, updateSelectedThread };
  },
  methods: {
    async sendMessage(_newMessage) {
      console.log("Sending Message on Thread ID:", this.threadId);
      let _thread = await this.computer.sync(this.threadId);
      let _date = new Date().toString();
      console.log("NewMessage: ", _newMessage);
      await _thread.post(
        this.pk,
        window.localStorage.getItem(Constants.DISPLAYNAME),
        _newMessage,
        _date
      );
      console.log(
        "Sent on Synced from ThreadID",
        this.threadId,
        "Thread",
        _thread
      );
      this.updateSelectedThread(_thread._rev);
    }
  }
};
</script>
<style scoped></style>
