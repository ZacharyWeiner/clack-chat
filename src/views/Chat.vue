<template>
  <Suspense>
    <template #default>
      <div :class="getClass('preSidebar')">
        <Sidebar />
        <div :class="getClass('preHeader')">
          <Header :title="threadTitle" />
          <main :class="getClass('main')">
            <div :class="getClass('content')">
              <div v-if="loading || !initLoaded">
                <LoadingPanel />
              </div>
              <div v-if="!loading && initLoaded">
                <div class="pb-5" v-if="thread && thread.title">
                  <!-- Thread Rev{{ thread._rev }}<br />
                  Thread ID{{ thread._id }}<br /> -->
                  <div v-if="messages.length > 0" :class="getClass('messages')">
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
  async setup() {
    let seed = window.localStorage.getItem(LSConstants.SEED);
    const revList = ref(["Loading..."]);
    const messages = ref([]);
    const thread = ref(null);
    //if there is a thread selected, init sync
    const selectedThread = ref(window.localStorage.getItem("SelectedThread"));
    const threadId = ref("");
    const loading = ref(false);
    const initLoaded = ref(false);
    const open = ref(false);
    const balance = ref(0);
    const to = ref("");
    const chatTitle = ref("");
    let _chain = window.localStorage.getItem(LSConstants.CHAIN);
    let _net = window.localStorage.getItem(LSConstants.NETWORK);
    console.log(_chain, _net);
    const computer = new Computer({
      chain: _chain,
      seed: seed,
      network: _net
    });
    const updateRevList = _revList => {
      revList.value = _revList;
      console.log(
        "updateRevList() called on Chat.vue with array",
        revList.value
      );
    };
    const updateLoading = _bool => {
      loading.value = _bool;
      console.log("updateLoading() on Chat.vue called with value:", _bool);
    };
    const updateSelectedThread = _id => {
      console.log("setting selected Thread Local Storage with id:", _id);
      window.localStorage.setItem("SelectedThread", _id);
      selectedThread.value = _id;
      console.log("updateSelectedThread() on Chat.vue Triggered:", _id);
    };
    const updateThread = _thread => {
      thread.value = _thread;
      console.log("updateThread() called on Chat.vue with thread: ", _thread);
    };
    const updateMessages = arr => {
      messages.value = arr;
      if (loading.value) loading.value = false;
      console.log(
        "updateMessages called on Chat.vue with messages array:",
        arr
      );
    };
    const showNewChatModal = () => {
      open.value = true;
    };
    const pk = ref(computer.db.wallet.getPublicKey().toString());

    console.log("User PK:", pk);
    provide(PIConstants.COMPUTER, computer);
    provide(PIConstants.REV_LIST_KEY, revList);
    provide(PIConstants.LOADING_KEY, loading);
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
      showNewChatModal,
      initLoaded
    };
  },
  async mounted() {
    //Redirect back to home if no Seed is found
    if (!window.localStorage.getItem(LSConstants.SEED)) {
      this.$router.push("/login");
    }
    //otherwise - mount the component
    console.log("Mouting Chat.vue with thread:", this.selectedThread);
    await this.pollAll();
    this.initLoaded = true;
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
      poll: null,
      polling: null,
      pollingMessages: null,
      pollingLatestRev: null,
      latestRev: 0
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
  beforeUnmount() {
    clearInterval(this.polling);
    clearInterval(this.pollingMessages);
    clearInterval(this.pollingLatestRev);
  },
  methods: {
    async pollAll() {
      this.poll = setInterval(async () => {
        //first get the latest threads, and send them to the sidebar
        let _revs = await this.computer.getRevs(this.pk);
        console.log("Revs returned from getRevs in pollAll()", _revs);
        if (this.revList != _revs) {
          console.log(
            "Revs returned is NOT EQUAL to this.revsList Updating Revs list."
          );
          this.updateRevList(_revs);
        }
        //if not -- do nothing.
        //
        //
        // check for messages to display:
        // If we have a thread selected by the side bar or updated from syncing the chat
        let initSync;
        if (this.selectedThread) {
          console.log("Polling has a selected thread:", this.selectedThread);
          try {
            initSync = await this.computer.sync(this.selectedThread);
            console.log("ObjectID from syncing rev:", initSync._id);
            this.latestRev = await this.computer.getLatestRev(initSync._id);
            console.log(
              "The latestRev from selected thread: \n",
              this.selectedThread,
              "is: \n" + this.latestRev
            );
          } catch (err) {
            console.log("There was an error fetching the latest rev: \n", err);
          }
          console.log("Messages in memory:", this.messages);
          //If there are no messages or there is a new message, the latest rev will not match the one we have in memory.
          if (
            this.latestRev !== this.selectedThread ||
            this.messages != initSync.messages
          ) {
            this.thread = await this.computer.sync(this.latestRev);
            console.log("Assigned updated thread after sync");
            if (this.thread.messages !== this.messages) {
              this.messages = this.thread.messages;
            }
          }
        } else {
          console.log("There is no selectedThread in memory.");
        }
        this.loading = false;
        //then check if we are looking at at thread.
        // if we are --
        // call get latestRev on thread._rev
        //if the latest rev is not equal to the thread rev
        // sync the thread with the latest rev
        //update the thread in memory.
        //update the messages list
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
        this.messages = [];
        console.log("Thread Created: ", thread_rev);
      } catch (err) {
        alert(err);
        this.open = false;
      }
    },
    getClass(placement) {
      let returnClass = "";
      switch (placement) {
        case "preSidebar":
          returnClass = "flex h-screen bg-gray-200 font-roboto";
          break;
        case "preHeader":
          returnClass = "flex-1 flex flex-col overflow-hidden";
          break;
        case "main":
          returnClass = "flex-1 overflow-x-hidden overflow-y-auto bg-gray-200";
          break;
        case "messages":
          returnClass = "pt-5 pb-3 pl-3 pr-3 bg-white rounded";
          break;
        case "content":
          returnClass = "mx-auto px-6 py-1";
          break;
        default:
          returnClass = "";
      }
      return returnClass;
    }
  }
};
</script>
<style scoped></style>
