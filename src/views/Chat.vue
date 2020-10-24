<template>
  <Suspense>
    <template #default>
      <div class="flex h-screen bg-gray-200 font-roboto">
        <Sidebar />
        <div class="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
            <div class="container mx-auto px-6 py-8">
              <div v-if="loading">
                Loading ...
              </div>

              <div v-if="!loading">
                {{ selectedThread }}
                {{ balance }}
                <div class="flex mb-4 float-right">
                  <div class="bg-gray-100 h-12 ">
                    <button
                      @click="open = true"
                      class="btn btn-primary w-full float-right"
                    >
                      + New Chat
                    </button>
                    <!--  -->
                  </div>
                </div>
                <Messages :messages="messages" />
              </div>
            </div>
          </main>
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
                  <div
                    class="modal-close cursor-pointer z-50"
                    @click="open = false"
                  >
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
        </div>
      </div>
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script>
import { provide, ref } from "vue";
//import ChatView from "./../components/chat/ChatView";
import Messages from "./../components/chat/Messages";
import * as LSConstants from "./../constants/LocalStorageConstants.js";
import * as PIConstants from "./../constants/ProvideInjectConstants.js";
import Computer from "bitcoin-computer";
import Header from "./../components/Header";
import Sidebar from "./../components/chat/Sidebar";
import FileUtils from "@/utilities/FileUtils.js";

export default {
  setup() {
    let seed = window.localStorage.getItem(LSConstants.SEED);
    const revList = ref(["nothing yet"]);
    const messages = ref(["nothing yet"]);
    //if there is a thread selected, init sync
    const selectedThread = ref(window.localStorage.getItem("SelectedThread"));
    const threadId = ref("");
    const loading = ref(false);
    const open = ref(false);
    const balance = ref(0);
    const computer = new Computer({
      chain: "BSV",
      seed: seed
    });
    const updateRevList = _revList => {
      revList.value = _revList;
      console.log("Set Rev List in updateRevList:", revList.value);
    };

    const updateLoading = _bool => {
      loading.value = _bool;
      console.log("Loading:", _bool);
    };

    const updateSelectedThread = _id => {
      window.localStorage.setItem("SelectedThread", _id);
      selectedThread.value = _id;
      console.log("Updated Selected Thread From Sidebar:", _id);
    };

    const updateMessages = arr => {
      messages.value = arr;
      console.log("executing updatingMessages:", arr);
      if (loading.value) loading.value = false;
    };

    const pk = ref(computer.db.wallet.getPublicKey().toString());
    console.log("User PK:", pk);

    provide(PIConstants.COMPUTER, computer);
    provide("revList", revList);
    provide("loading", loading);
    provide("selectedThread", selectedThread);
    provide("userPK", pk);
    provide(PIConstants.MESSAGES_KEY, messages);
    provide(PIConstants.UPDATE_REV_LIST_FUNCTION, updateRevList);
    provide(PIConstants.UPDATE_LOADING_FUNCTION, updateLoading);
    provide(PIConstants.UPDATE_SELECTED_REV_FUNCTION, updateSelectedThread);
    provide(PIConstants.UPDATE_MESSAGES_FUNCTION, updateMessages);
    return {
      selectedThread,
      computer,
      threadId,
      loading,
      updateLoading,
      updateRevList,
      updateSelectedThread,
      open,
      balance,
      revList,
      messages,
      updateMessages
    };
  },
  mounted() {
    //Redirect back to home if no Seed is found
    if (!window.localStorage.getItem(LSConstants.SEED)) {
      this.$router.push("/");
    }
    //otherwise - mount the component
    console.log("Mouting Chat.vue with thread:", this.selectedThread);
    this.pollThreads();
    this.pollMessages();
  },
  components: {
    Messages,
    Header,
    Sidebar
  },
  data: function() {
    return {
      polling: null,
      pollingMessages: null
    };
  },
  methods: {
    pollThreads() {
      this.polling = setInterval(async () => {
        this.computer.db.wallet
          .getBalance(this.pk)
          .then(r => (this.balance = r));
        this.computer.getRevs(this.pk).then(r => {
          this.updateRevList(r);
        });
        console.log("settimeout ended");
      }, 3000);
    },
    pollMessages() {
      this.pollingMessages = setInterval(async () => {
        if (this.selectedThread) {
          this.computer.sync(this.selectedThread).then(r => {
            this.updateMessages(r.messages);
            console.log("Messages Loaded:", r.messages);
          });
        }
        if (this.loading === true) {
          this.loading = false;
        }
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
    }
  }
};
</script>
<style scoped></style>
