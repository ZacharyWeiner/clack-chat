<template>
  <Suspense>
    <template #default>
      <div class="flex h-screen bg-gray-200 font-roboto">
        <Sidebar />
        <div class="flex-1 flex flex-col overflow-hidden">
          <Header :title="threadTitle" />
          <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
            <div class=" mx-auto px-6 py-1">
              <div v-if="loading">
                <LoadingPanel />
              </div>
              <div v-if="!loading">
                <div class="pb-5" v-if="thread && thread.title">
                  <div
                    v-if="messages.length > 0"
                    class="pt-5 pb-3 pl-3 pr-3 bg-white rounded"
                  >
                    <Messages :messages="messages" />
                  </div>
                  <SendMessage />
                </div>
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
              class="modal-container w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto"
            >
              <!-- Add margin if you want to see some of the overlay behind the modal-->
              <div class="modal-content py-4 text-left px-6">
                <!--Body-->
                <div
                  class="max-w-sm w-full bg-white shadow-md rounded-md overflow-hidden border"
                >
                  <form>
                    <div
                      class="flex justify-between items-center px-5 py-3 text-gray-700 border-b"
                    >
                      <h3 class="text-xl">Create a New Thread</h3>
                      <button @click="open = false">
                        <svg
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div class="px-1 py-2 bg-gray-200 text-gray-700 border-b">
                      <label class="text-xs">Name Your New Thread</label>

                      <div class="mt-2 relative rounded-md shadow-sm">
                        <span
                          class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600"
                        >
                          <svg
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                            />
                          </svg>
                        </span>

                        <input
                          v-model="chatTitle"
                          type="text"
                          class="form-input w-full px-12 py-2 appearance-none rounded-md focus:border-indigo-600"
                        />
                      </div>
                    </div>
                    <div class="px-1 py-1 bg-gray-200 text-gray-700 border-b">
                      <label class="text-xs">Invite With Public Key</label>

                      <div class="mt-2 relative rounded-md shadow-sm">
                        <span
                          class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600"
                        >
                          <svg
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                            />
                          </svg>
                        </span>

                        <input
                          type="text"
                          class="form-input w-full px-12 py-2 appearance-none rounded-md focus:border-indigo-600"
                          v-model="to"
                        />
                      </div>
                    </div>

                    <div class="flex justify-between items-center px-5 py-3">
                      <button
                        @click="open = false"
                        class="px-3 py-1 text-gray-700 text-sm rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none"
                      >
                        Cancel
                      </button>
                      <button
                        @click.prevent="createNewChatThread(chatTitle, to, pk)"
                        class="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-500 focus:outline-none"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #fallback>
      <div><i class="fas fa-spinner text-xl"></i> YYY Loading...</div>
    </template>
  </Suspense>
</template>

<script>
import { provide, ref } from "vue";
import LoadingPanel from "./../components/chat/LoadingPanel";
import Messages from "./../components/chat/Messages";
import * as LSConstants from "./../constants/LocalStorageConstants.js";
import * as PIConstants from "./../constants/ProvideInjectConstants.js";
import Computer from "bitcoin-computer";
import Header from "./../components/Header";
import Sidebar from "./../components/chat/Sidebar";
import SendMessage from "./../components/chat/SendMessage";
import FileUtils from "@/utilities/FileUtils.js";

export default {
  setup() {
    let seed = window.localStorage.getItem(LSConstants.SEED);
    const revList = ref(["Loading..."]);
    const messages = ref([]);
    const thread = ref(null);
    //if there is a thread selected, init sync
    const selectedThread = ref(window.localStorage.getItem("SelectedThread"));
    const threadId = ref("");
    const loading = ref(false);
    const open = ref(false);
    const balance = ref(0);
    const to = ref("");
    const chatTitle = ref("");
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
      thread.value = null;
      console.log("updateSelectedThread() on Chat.vue Triggered:", _id);
    };

    const updateThread = _thread => {
      thread.value = _thread;
      console.log("Updated Thread ", _thread);
    };

    const updateMessages = arr => {
      messages.value = arr;
      console.log("executing updatingMessages:", arr);
      if (loading.value) loading.value = false;
    };

    const showNewChatModal = () => {
      open.value = true;
    };
    const pk = ref(computer.db.wallet.getPublicKey().toString());
    console.log("User PK:", pk);

    provide(PIConstants.COMPUTER, computer);
    provide("revList", revList);
    provide("loading", loading);
    provide(PIConstants.SELECTED_THREAD_ID_KEY, selectedThread);
    provide(PIConstants.PUBLIC_KEY, pk);
    provide(PIConstants.THREAD_KEY, thread);
    provide(PIConstants.MESSAGES_KEY, messages);
    provide(PIConstants.UPDATE_REV_LIST_FUNCTION, updateRevList);
    provide(PIConstants.UPDATE_LOADING_FUNCTION, updateLoading);
    provide(PIConstants.UPDATE_SELECTED_REV_FUNCTION, updateSelectedThread);
    provide(PIConstants.UPDATE_MESSAGES_FUNCTION, updateMessages);
    provide(PIConstants.UPDATE_THREAD_FUNCTION, updateThread);
    provide(PIConstants.SHOW_NEW_CHAT_MODAL_FUNCTION, showNewChatModal);
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
      updateMessages,
      thread,
      updateThread,
      to,
      chatTitle,
      pk,
      showNewChatModal
    };
  },
  mounted() {
    //Redirect back to home if no Seed is found
    if (!window.localStorage.getItem(LSConstants.SEED)) {
      this.$router.push("/login");
    }
    //otherwise - mount the component
    console.log("Mouting Chat.vue with thread:", this.selectedThread);
    this.pollThreads();
    this.pollMessages();
  },
  components: {
    Messages,
    Header,
    Sidebar,
    SendMessage,
    LoadingPanel
  },
  data: function() {
    return {
      polling: null,
      pollingMessages: null
    };
  },
  computed: {
    threadTitle() {
      if (this.thread) {
        return this.thread.title;
      } else if (this.loading) {
        return "Loading ...";
      }
      return "Select A Chat";
    }
  },
  methods: {
    pollThreads() {
      this.polling = setInterval(async () => {
        this.computer.db.wallet
          .getBalance(this.pk)
          .then(r => (this.balance = r));
        this.computer.getRevs(this.pk).then(r => {
          console.log("Logging R:", r, r.length);
          if (r.length > 0) {
            this.updateRevList(r);
          } else {
            this.updateRevList(["Create A Chat To Start"]);
          }
        });
        console.log("settimeout ended");
      }, 3000);
    },
    pollMessages() {
      this.pollingMessages = setInterval(async () => {
        if (this.selectedThread) {
          this.computer.sync(this.selectedThread).then(r => {
            this.updateThread(r);
            if (r.messages.length > 0) {
              this.updateMessages(r.messages);
              console.log("Messages Loaded:", r.messages);
            }
          });
        }
        if (this.loading === true) {
          this.loading = false;
        }
      }, 3000);
    },
    async createNewChatThread(chatTitle, to, pk) {
      console.log(chatTitle + " : " + pk + " : " + to);
      try {
        let _contract = await FileUtils.importFromPublic("chat-thread.js");
        let thread_rev = await this.computer.new(_contract, [
          [pk, to],
          "clack.chat",
          chatTitle
        ]);
        this.open = false;
        console.log("Thread Created: ", thread_rev);
      } catch (err) {
        alert(err);
        this.open = false;
      }
    }
  }
};
</script>
<style scoped></style>
