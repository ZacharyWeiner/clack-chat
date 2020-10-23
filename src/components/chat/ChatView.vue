<template>
  <div>
    <div class="flex mb-4 float-right">
      <div class="bg-gray-100 h-12 ">
        <button @click="open = true" class="btn btn-primary w-full float-right">
          + New Chat
        </button>
        <!--  -->
      </div>
    </div>
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
          class="btn btn-secondary float-right">
          <i class="fa fa-paper-plane mr-3"></i> Send
        </button>
      </div>
    </div>
  </div>
  <div
    :class="
      `modal ${!open &&
        'opacity-0 pointer-events-none'} z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`
    "
  >
    <div
      class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
    ></div>

    <div
      class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto"
    >
      <!-- Add margin if you want to see some of the overlay behind the modal-->
      <div class="modal-content py-4 text-left px-6">
        <!--Title-->
        <div class="flex justify-between items-center pb-3">
          <p class="text-2xl font-bold">Create A New Chat Thread</p>
          <div class="modal-close cursor-pointer z-50" @click="open = false">
            <svg
              class="fill-current text-black"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <path
                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
              />
            </svg>
          </div>
        </div>

        <!--Body-->
        <p>Modal content.</p>

        <!--Footer-->
        <div class="flex justify-end pt-2">
          <button
            @click="open = false"
            class="px-6 py-3 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2"
          >
            Close
          </button>
          <button
            @click="createNewChatThread"
            class="px-6 py-3 bg-indigo-600 rounded-md text-white font-medium tracking-wide hover:bg-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { inject, ref } from "vue";
import Computer from "bitcoin-computer";
import * as Constants from "./../../constants/LocalStorageConstants.js";
import FileUtils from "@/utilities/FileUtils.js";
export default {
  async setup(props) {
    const revList = inject("revList");
    const updateRevList = inject("updateRevList");
    let messagesList = ["none"];
    const messages = ref(messagesList);
    const open = ref(false);
    const threadId = ref(props.selectedThread);
    const newMessage = ref("");
    const showNewMessage = ref(false);
    const threadTitle = ref("");
    let seed = window.localStorage.getItem(Constants.SEED);
    const computer = new Computer({
      chain: "BSV",
      seed: seed
    });

    const _pk = computer.db.wallet.getPublicKey().toString();
    const pk = ref(_pk);
    console.log("PK:", _pk);
    let balance = ref(await computer.db.wallet.getBalance(_pk));
    let _revs = await computer.getRevs(_pk);
    let revs = ref(_revs);
    updateRevList(_revs);
    console.log(revs.value.length);
    console.log(balance);
    return {
      computer,
      balance,
      revs,
      pk,
      open,
      threadId,
      messages,
      newMessage,
      showNewMessage,
      threadTitle,
      revList
    };
  },
  data: function() {
    return {
      polling: null
    };
  },
  mounted() {
    console.log("Chat Vue was mounted");
    if (this.$route.params.id) {
      this.changeThread(this.$route.params.id);
    }
  },
  created() {
    this.pollData();
  },
  methods: {
    pollData() {
      this.polling = setInterval(() => {
        console.log("settimeout running");
        let _saved = window.localStorage.getItem("SelectedThread");
        console.log("Saved: ", _saved, "this.Thread:", this.threadId);
        if (_saved && _saved != this.threadId) {
          this.changeThread(window.localStorage.getItem("SelectedThread"));
        }
        console.log("settimeout ended");
      }, 3000);
    },
    async createNewChatThread() {
      console.log("doing this now");
      try {
        let _contract = await FileUtils.importFromPublic("chat-thread.js");
        let thread_rev = await this.computer.new(_contract, [
          this.pk,
          "clack.chat",
          "Some Thread"
        ]);
        console.log("Thread Created: ", thread_rev);
      } catch (err) {
        alert(err);
      }
      this.open = false;
    },
    async changeThread(_threadId) {
      this.threadId = _threadId;
      console.log(this.threadId);
      let thread = await this.computer.sync(_threadId);
      console.log(thread.title);
      //thread.messages.push("new message");

      this.messages = thread.messages;
      this.showNewMessage = true;
      this.threadTitle = thread.title;
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
