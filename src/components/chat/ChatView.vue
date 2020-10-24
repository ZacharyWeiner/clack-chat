<template>
  <div>
    <div class="w-full h-12 px-12">
      <div v-if="threadTitle !== ''">
        <h3 class="px-6 text-4xl">{{ threadTitle }}</h3>
        <div
          class="border-2 border-dashed border-gray-400 rounded-lg h-96"
        ></div>
      </div>
      <div v-for="m in messages" :key="m">
        <div class="rounded  overflow-hidden shadow-lg mt-6">
          <div class="px-6 py-4">
            <div class="text-gray-900 font-bold text-xl mb-2">
              {{ m.split(":")[1] }} - <small>{{ m.split(":")[3] }}</small>
            </div>
            <p class="text-gray-700 text-lg text-base">
              {{ m.split(":")[2] }}
            </p>
          </div>
        </div>
      </div>
      <div v-if="showNewMessage">
        <textarea
          class="form-textarea w-full mt-6 rounded-md border-indigo-600 bg-gray-100"
          rows="3"
          v-model="newMessage"
          placeholder="New Message..."
        />
        <button
          @click.prevent="sendMessage"
          class="btn btn-secondary float-right"
        >
          <i class="fa fa-paper-plane mr-3"></i> Send
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { inject, ref } from "vue";
import * as Constants from "./../../constants/LocalStorageConstants.js";
import * as PIConstants from "./../../constants/ProvideInjectConstants.js";

export default {
  async setup() {
    const revList = inject("revList");
    const updateLoading = inject(PIConstants.UPDATE_LOADING_FUNCTION);
    const computer = inject(PIConstants.COMPUTER);
    let messagesList = ["none"];
    const messages = ref(messagesList);
    const open = ref(false);
    const threadId = inject("selectedThread");
    console.log("ThreadID on ChatView aka SelectedThread on chat:", threadId);
    const newMessage = ref("");
    const showNewMessage = ref(false);
    const threadTitle = ref("");
    return {
      computer,

      open,
      threadId,
      messages,
      newMessage,
      showNewMessage,
      threadTitle,
      revList,
      updateLoading
    };
  },
  mounted() {
    console.log("Chat Vue was mounted");
    if (this.$route.params.id) {
      this.changeThread(this.$route.params.id);
    }
  },
  methods: {
    async changeThread(_threadId) {
      console.log("ChatView Changing Thread:", _threadId);
      this.updateLoading(true);
      this.threadId = _threadId;
      console.log(this.threadId);
      let thread = await this.computer.sync(_threadId);
      console.log(thread.title);
      //thread.messages.push("new message");

      this.messages = thread.messages;
      this.showNewMessage = true;
      this.threadTitle = thread.title;
      this.updateLoading(false);
    },
    async sendMessage() {
      let thread = await this.computer.sync(this.threadId);
      let _date = new Date().toString();
      console.log("NewMessage: ", this.newMessage);
      await thread.post(
        this.pk,
        window.localStorage.getItem(Constants.DISPLAYNAME),
        this.newMessage,
        _date
      );
    },
    getShortRev(_rev) {
      return `${_rev.substring(0, 5)} ... ${_rev.substring(
        _rev.length - 8,
        _rev.length - 2
      )}`;
    }
  },
  props: ["selectedThread"]
};
</script>
<style></style>
