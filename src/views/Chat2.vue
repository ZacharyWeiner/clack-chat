<template>
  <Suspense>
    <template #default>
      <div class="flex h-screen bg-gray-200 font-roboto">
        <div class="flex">
          <!-- Backdrop -->
          <div
            :class="isOpen ? 'block' : 'hidden'"
            @click="isOpen = false"
            class="fixed z-20 inset-0 bg-black opacity-50 transition-opacity lg:hidden"
          ></div>
          <!-- End Backdrop -->

          <div
            :class="
              isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
            "
            class="fixed z-30 inset-y-0 left-0 w-64 transition duration-300 transform bg-gray-900 overflow-y-auto lg:translate-x-0 lg:static lg:inset-0"
          >
            <div class="flex items-center justify-center mt-8">
              <div class="flex items-center">
                <Logo />
                <span class="text-white text-2xl mx-2 font-semibold"
                  >ClackChat</span
                >
              </div>
            </div>

            <nav class="mt-10">
              <button
                @click.prevent="showNewChatModal"
                class="flex items-center mt-4 py-2 px-6 border-l-4 border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100"
              >
                <i class="fas fa-plus h-5 w-5" aria-hidden="true"></i
                ><span class="mx-4 text-lg ">New Chat</span>
              </button>
              <button
                class="flex items-center mt-4 py-2 px-6 border-l-4 border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100"
              >
                <i class="fas fa-comments h-5 w-5" aria-hidden="true"></i
                ><span class="mx-4 text-lg "> My Threads</span>
              </button>
              <button
                class="flex w-full items-center mt-4 mb-4"
                v-for="thread in chatThreadsList"
                :key="thread._id"
                @click.prevent="updateCurrentChatThread(thread)"
              >
                <span class="mx-5 px-5 text-gray-500">{{ thread.title }} </span>
              </button>
            </nav>
          </div>
        </div>

        <div class="w-2/4">
          <div v-if="loading"><LoadingPanel /></div>
          <div class=" w-full">
            <h3>
              {{
                currentChatThread ? currentChatThread.title : "Select A Chat"
              }}
            </h3>
            <button @click.prevent="addMyProfileToThread">
              Add My Profile
            </button>
            <hr />
            <div
              id="messageContainer"
              class="overflow-y-auto"
              style="max-height:600px;"
            >
              <div v-for="m in reverseMessages" :key="m.date">
                <div class="items-start pb-4 bg-gray-100 rounded">
                  <img
                    :src="getProfileImageForMessage(m)"
                    class="w-10 h-10 rounded mr-3"
                  />
                  <div class="flex-1 overflow-hidden">
                    <div class="">
                      <span class="font-bold text-xs underline">{{
                        getDisplayNameForMessage(m)
                      }}</span>
                      <span class="pl-3"></span>
                      <span class="text-grey text-xs"> </span>
                    </div>
                    <br />
                    <div class="message">
                      <vue3-markdown-it :source="JSON.parse(m).message" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <NewMessage />
        </div>
        <div class="w-1/4">
          <h3>Members In Chat</h3>
          <div v-for="profile in profiles" :key="profile._rev">
            <Sidecard :profile="profile" />
          </div>
          <h3>Lurkers</h3>
          <div v-for="owner in currentChatThread._owners" :key="owner">
            <div v-if="!hasProfile(owner)">
              {{ owner }}
            </div>
          </div>
        </div>
        <!-- Begin New Chat Modal -->
        <div
          :class="
            `modal ${!showNewChat &&
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
                    <button @click="showNewChatModal">
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
                        v-model="titleForNewChat"
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
                        v-model="pkForNewChat"
                      />
                    </div>
                  </div>

                  <div class="flex justify-between items-center px-5 py-3">
                    <button
                      @click="showNewChat = false"
                      class="px-3 py-1 text-gray-700 text-sm rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      @click.prevent="
                        createNewChatThread(titleForNewChat, pkForNewChat, publicKey)
                      "
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
        <!-- End New Chat Modal -->
      </div>
    </template>
    <template #fallback>
      <div><LoadingPanel /></div>
    </template>
  </Suspense>
</template>

<script>
import { provide, ref } from "vue";
import LoadingPanel from "./../components/chat/LoadingPanel";
import * as LSConstants from "./../constants/LocalStorageConstants.js";
import * as PIConstants from "./../constants/ProvideInjectConstants.js";
import * as BCCConstants from "./../constants/BitcoinComputerConstants.js";
import Computer from "bitcoin-computer";
import FileUtils from "@/utilities/FileUtils.js";
import BitcoinComputerUtils from "@/utilities/BitcoinComputerUtils.js";
//import Message from "@/components/chat2/Message";
import NewMessage from "@/components/chat2/NewMessage";
import Sidecard from "@/components/profile/Sidecard";
import Logo from "./../components/Logo";
export default {
  async setup() {
    console.log("Chat2.setup() beginning.");
    //Create these as variables to print later,
    //Otherwise just use the getItem method directly
    //to initalize the computer.
    let currentRevisionsList = [];
    const seed = window.localStorage.getItem(LSConstants.SEED);
    const chain = window.localStorage.getItem(LSConstants.CHAIN);
    const net = window.localStorage.getItem(LSConstants.NETWORK);
    const pausePolling = ref(false);
    //Use const = Ref ->
    //When if a value change should notify the UI
    //causing an update
    const loading = ref(false);
    const initLoaded = ref(false);
    const showNewChat = ref(false);
    const balance = ref(0);
    const newestRevisionsList = ref([]);
    const chatThreadsList = ref([]);
    const profiles = ref([]);
    const selectedThreadIndex = ref(0);
    const currentChatThread = ref(null);
    const currentMessages = ref([]);
    const myProfile = ref(null);
    const savedChatId = ref("");
    const titleForNewChat = ref("");
    const pkForNewChat = ref("");
    const computer = new Computer({
      seed: seed,
      chain: chain,
      network: net
    });
    const publicKey = ref(computer.db.wallet.getPublicKey().toString());
    console.log(
      `Computer Initialized on Chat.vue with \n seed: ${seed} \n\n on chain ${chain} and network: ${net}`
    );
    const updateLoading = _bool => {
      loading.value = _bool;
      console.log("updateLoading() on Chat.vue called with value:", _bool);
    };
    const showNewChatModal = () => {
      showNewChat.value = true;
    };
    const updateChatThreadsList = _list => {
      console.log("Updating Chat Threads List.");
      chatThreadsList.value = _list;
    };
    const updateSelectedThreadIndex = _index => {
      console.log("Updating the Selected Thread Index.");
      selectedThreadIndex.value = _index;
    };
    const updateProfilesList = _list => {
      console.log("Updating Profiles List.");
      profiles.value = _list;
    };
    const updateCurrentRevisionsList = _list => {
      console.log("Updating Current Revisions List.");
      currentRevisionsList.value = _list;
    };

    const syncThreadProfiles = async () => {
      pausePolling.value = true;
      let keyPairs = currentChatThread.value.profiles;
      console.log("Profile Keypairs", keyPairs);
      keyPairs.forEach(async kp => {
        let _asJson = JSON.parse(kp);
        console.log("about to sync profile");
        let _profile = await computer.sync(_asJson.profileId);
        console.log("sync profile complete", _profile);
        profiles.value.push(_profile);
      });
      pausePolling.value = false;
    };

    const updateCurrentChatThread = _thread => {
      console.log("Updating chat thread to:", _thread);
      currentChatThread.value = _thread;
      currentMessages.value = _thread.messages;
      window.localStorage.setItem(LSConstants.CHAT_THREAD_ID, _thread._id);
      profiles.value = [];
      syncThreadProfiles();
    };

    const updateCurrentMessages = _msgList => {
      console.log("updating the currentmesssage list:", _msgList);
      currentMessages.value = _msgList;
    };

    const sendNewMessage = async _message => {
      pausePolling.value = true;
      console.log(
        "Sending New Message thread: ",
        currentChatThread.value.title
      );
      console.log("Message", _message);
      let _date = new Date().toString();
      let asJson = {
        pubKey: publicKey.value,
        displayName: window.localStorage.getItem(LSConstants.DISPLAYNAME),
        message: _message,
        date: _date
      };
      console.log(asJson);
      let latestRev = await computer.getLatestRev(currentChatThread.value._id);
      console.log(
        "Before Sending a message to the thread check if we need to sync the object."
      );
      let syncedForSend = await computer.sync(latestRev);
      await syncedForSend.post(JSON.stringify(asJson));
      console.log(
        "New Message sent to chat thread: ",
        currentChatThread.value.title
      );
      currentMessages.value = [...JSON.stringify(asJson)];
      pausePolling.value = false;
    };
    //Inital state shoudl do all the heavy lifting
    //This way the polling method that runs most often can be light weight.
    const syncRevisions = async newestRevisions => {
      //One by one, sync all the objects from the revisions.
      let _threadsList = [];
      let _profilesList = [];
      await newestRevisions.map(async revision => {
        console.log(
          "Preparing Chat.fetchInitialState() to sync revision:",
          revision
        );
        let _smartObject = await computer.sync(revision);
        console.log("Fetched Smart Object:", _smartObject);
        //If the object is a chat-thread ->
        if (
          _smartObject.contractTypeID ===
          BCCConstants.CONTRACT_TYPE_ID_CHAT_THREAD
        ) {
          //push it into the chat-threads list
          _threadsList.push(_smartObject);
        }
        //If the object is a profile
        else if (
          _smartObject.contractTypeID ===
          BCCConstants.CONTRACT_TYPE_ID_USER_PROFILE
        ) {
          //Check if there are any profiles in the list for this user already.
          if (profiles.value.length === 0) {
            //If not, push this profile into the profiles collection.
            //_profilesList.push(_smartObject);
            myProfile.value = _smartObject;
          }
          //If so, check both profiles for this PK
          //   If one of them has an owner matching our application PK,
          //       store that as the users selected profile in localstorage
          //       &  push that one into the profiles list
          //   If none have assigned this app as an owner, leave the one in the list.
        }
      });
      updateChatThreadsList(_threadsList);
      updateProfilesList(_profilesList);
      console.log("the list of chat-threads is: \n", _threadsList);
      console.log("the list of profiles is: \n", _profilesList);
      return { _threadsList, _profilesList };
    };

    const getNewestRevisions = async () => {
      let newestRevisions = await BitcoinComputerUtils.getLatestSmartObjectRevisionIds(
        computer,
        publicKey.value
      );
      //If we get an error from fetching the latest smart object revisisons, do not go on.
      if (typeof newestRevisions === Error) {
        return;
      }
      console.log(
        "Data returned from BitcoinUtils.getLatestSmartObjects in fetchInitalState(): \n ",
        newestRevisions
      );
      //Store the revisions collection in a variable to be used later in Polling for Updates.
      return newestRevisions;
    };

    const fetchInitialState = async () => {
      console.log("fetchingInitialState() on Chat2.vue");
      let newestRevisions = [];
      updateLoading(true);
      //check to see if we have a chat thread ID stored in localStorage.

      //Get all the revisions from the public Key of the user
      newestRevisions = await getNewestRevisions();
      console.log("returned from getting newest revisisons.", newestRevisions);
      let { _threadsList, _profilesList } = await syncRevisions(
        newestRevisions
      );
      console.log(
        "Returned Chats Profiles List For Current User",
        _threadsList,
        _profilesList
      );
      let saved_id = window.localStorage.getItem(LSConstants.CHAT_THREAD_ID);
      if (saved_id) {
        _threadsList.map(t => {
          if (t._id === saved_id) {
            currentChatThread.value = t;
            currentMessages.value = t.messages;
          }
        });
      }
      //When all the smart objects have been synced and filtered.
      //If there is no thread ID in storage assign the most recent chat-thread to the selected thread.
      //In the method that updates the selected thread, assign the messages collection from the selected thread.
      //All threads are synced at this point.
      //start polling for updates.

      initLoaded.value = true;
      currentRevisionsList = newestRevisions;
      updateLoading(false);
      console.log("Completed fetchingInitialState() on Chat2.vue");
      syncThreadProfiles();
      return newestRevisions;
    };
    provide(PIConstants.COMPUTER, computer);
    provide(PIConstants.LOADING_KEY, loading);
    provide(PIConstants.SEND_NEW_MESSAGE_FUNCTION, sendNewMessage);
    provide(PIConstants.UPDATE_LOADING_FUNCTION, updateLoading);
    if (!initLoaded.value) {
      let rs = await fetchInitialState();
      console.log("Rs: ", rs);
    }
    console.log("Chat2.setup() returning");
    return {
      loading,
      updateLoading,
      seed,
      chain,
      net,
      computer,
      publicKey,
      balance,
      newestRevisionsList,
      chatThreadsList,
      profiles,
      selectedThreadIndex,
      updateSelectedThreadIndex,
      showNewChatModal,
      showNewChat,
      initLoaded,
      updateChatThreadsList,
      updateProfilesList,
      fetchInitialState,
      getNewestRevisions,
      syncRevisions,
      currentRevisionsList,
      updateCurrentRevisionsList,
      sendNewMessage,
      currentChatThread,
      updateCurrentChatThread,
      currentMessages,
      updateCurrentMessages,
      myProfile,
      savedChatId,
      titleForNewChat,
      pkForNewChat
    };
  },
  async mounted() {
    console.log("mounted() called on Chat2.vue");
    //Redirect back to home if no Seed is found
    if (!window.localStorage.getItem(LSConstants.SEED)) {
      this.$router.push("/login");
    }
    // var objDiv = document.getElementById("messageContainer");
    // objDiv.scrollTop = this.chatThreadsList[this.selectedThreadIndex].messages.length * 150;
    // console.log("Scroll Top:", objDiv.scrollHeight);
    //otherwise - start polling for new messages.
    this.pollForUpdates();
  },

  components: {
    LoadingPanel,
    //Message,
    Sidecard,
    NewMessage,
    Logo
  },
  //Use Data properties ->
  // where the state of the propery is not bound to the UI
  data: function() {
    return {
      poll: null,
      initalStateSet: false,
      pollingForUpdates: false
    };
  },
  computed: {
    reverseMessages() {
      if (this.currentMessages) {
        let _messages = [...this.currentMessages];
        return _messages.reverse();
      }
      return [];
    }
  },
  beforeUnmount() {
    console.log("beforeUnmount() called on Chat2.vue");
    //This.poll is set to a function that runs every X seconds
    //if this componenet is being unmounted, we need to make sure
    //the polling method is killed. Otherwise they will keep running
    // and every time the ocmponent loads again, the browser will have a
    //2nd, 3rd, 4th, etc... polling method running at the same time.
    clearInterval(this.poll);
  },
  methods: {
    hasProfile(ownerPk) {
      console.log("Comparing PK for profiles:", ownerPk);
      let _profilePubKeys = this.currentChatThread.profiles.map(p => {
        return JSON.parse(p).pubKey;
      });
      console.log("Profiles List Public Keys", _profilePubKeys);
      if (_profilePubKeys.includes(ownerPk)) {
        return true;
      } else {
        return false;
      }
    },
    selectIndex(_index) {
      console.log("Selecting chat at array index:", _index);
      this.updateCurrentChatThread(this.chatThreadsList[_index]);
      this.updateCurrentMessages(this.chatThreadsList[_index].messages);
    },
    getProfileImageForMessage(message) {
      let _message = null;
      try {
        _message = JSON.parse(message);
      } catch (err) {
        console.log(err);
        return "";
      }
      let pubKey = _message.pubKey;
      console.log(
        "Message for getting URL should be the PubKey of owner or null",
        pubKey
      );
      let profile = null;
      this.profiles.map(p => {
        console.log("Owners & Public Key:", p._owners, pubKey);
        if (p._owners.includes(pubKey)) {
          profile = p;
          console.log("Got profile for image, src is:", profile.image);
        }
      });
      return profile ? profile.image : "default image path";
    },
    getDisplayNameForMessage(message) {
      let _message = null;
      try {
        _message = JSON.parse(message);
      } catch (err) {
        console.log(err);
        return "";
      }
      let pubKey = _message.pubKey;
      console.log(
        "Message for getting display Name should be the pubKey of owner or null",
        pubKey
      );
      let profile = null;
      this.profiles.map(p => {
        console.log("Owners & Public Key:", p._owners, pubKey);
        if (p._owners.includes(pubKey)) {
          profile = p;
          console.log(
            "Got profile for displayName, name is:",
            profile.displayName
          );
        }
      });
      return profile ? profile.displayName : message.displayName;
    },
    async addMyProfileToThread() {
      if (!this.myProfile) {
        alert(
          "You have to have a profile before you can add it. Head over to clack.chat/profile to set one up."
        );
        return;
      }
      this.pausePolling = true;
      let asJson = {
        pubKey: this.publicKey,
        profileId: this.myProfile._id
      };
      let latestRevision = await this.computer.getLatestRev(
        this.currentChatThread._id
      );
      console.log(
        "Result from getting latest rev so we can add a profile",
        latestRevision
      );
      let syncedForSend = await this.computer.sync(latestRevision);
      console.log(
        "Synced before adding profile to collection: ",
        syncedForSend
      );
      let canSend = true;
      if ("profiles" in syncedForSend) {
        syncedForSend.profiles.map(p => {
          if (JSON.parse(p).pubKey == this.publicKey) {
            canSend = false;
          }
        });
        if (canSend) {
          let pair = JSON.stringify(asJson);
          console.log("PubKey Profile Pair to Save:", pair);
          let result = await syncedForSend.addProfile(pair);
          console.log("The result of adding the profile was: ", result);
          if(result === "success"){alert("Successfully Added Your Profile Refresh To See The Changes.")}
        }
      } else {
        console.log("The chat thread does not have a profiles field.");
      }
      this.pausePolling = false;
    },
    async pollForUpdates() {
      console.log("pollForUpdates() called on Chat2.vue");
      this.poll = setInterval(async () => {
        //If we are sending a message, dont run this polling session.
        if (this.pausePolling === true) {
          return;
        }

        console.log("polling from this.poll() =>{setInterval} on Chat2.vue");
        //Get the latest revisions for this users PK
        let response = await this.getNewestRevisions();
        if (response instanceof Error) {
          alert(response);
          return;
        }
        console.log(
          "Response: \n",
          response,
          "currentRevs:",
          this.currentRevisionsList
        );
        //traverse the list of old revsisons and new revisisons, and pull a collection of the new ones.
        let comparison = this.selectNewRevsFromResponse(
          response,
          this.currentRevisionsList
        );
        this.currentRevisionsList = response;
        //If the list is === to the current list of revisions do nothing, the state has not changed.
        if (comparison.length === 0) {
          console.log(
            "Nothing Has Changed, All revisions are the same as the last poll"
          );
        } else {
          console.log(
            "The revisions list has change since the last update:",
            comparison
          );
          //For each revision ->
          let in_memory = [];
          //Check if its already synced or if its a new one.
          //if we have one with the same rev in memory its the old rev.
          comparison.map(c => {
            this.chatThreadsList.forEach(ct => {
              if (ct._rev === c) {
                in_memory.push(c);
              }
            });
          });
          //re-filter the list to only get the new ones.
          let newChatRevs = this.selectNewRevsFromResponse(
            comparison,
            in_memory
          );
          console.log("New Revs Only: ", newChatRevs);
          newChatRevs.map(async nr => {
            let _synced = await this.computer.sync(nr);
            console.log(
              "Synced newest revision for chat thread with title: ",
              _synced.title
            );
            let indexOfMatching = -1;
            this.chatThreadsList.forEach((ct, index) => {
              if (ct._id === _synced._id) {
                console.log("A thread in the current list has been updated");
                indexOfMatching = index;
              }
            });
            if (indexOfMatching > -1) {
              this.chatThreadsList[indexOfMatching] = _synced;
              if (this.currentChatThread._id === _synced._id) {
                this.updateCurrentMessages(_synced.messages);
              }
              console.log("Set Chat threads at index: ", indexOfMatching);
            } else {
              this.chatThreadsList.push(_synced);
              console.log("New Chat thread added to the end of the collection");
            }
          });
        }
        console.log(
          "this.poll() =>{setInterval} iteration complete on Chat2.vue"
        );
        if (this.loading) this.updateLoading(false);
      }, 5000);
    },
    selectNewRevsFromResponse(currentRevisions, newRevisions) {
      var a = [];
      var diff = [];
      for (var i = 0; i < currentRevisions.length; i++) {
        a[currentRevisions[i]] = true;
      }

      for (var ii = 0; ii < newRevisions.length; ii++) {
        if (a[newRevisions[ii]]) {
          delete a[newRevisions[ii]];
        } else {
          a[newRevisions[ii]] = true;
        }
      }

      for (var k in a) {
        diff.push(k);
      }
      return diff;
    },
    async fetchProfiles() {
      console.log("fetchProfiles() called on Chat2.vue");
      //This method should run any time a new thread is selected.
      //First get the PKs of all the owners in the thread.
      //for each owner
      // if the owner is our user -> skip them.
      //    We got their profile setting up the initial state.
      // If not ->
      //     get the current revisisons for the owner PK.
      //     loop the revisions while the owners profile is not set
      //       in each loop sync a revision and check the object.
      //         if it is not a profile, dump it and move on.
      //         if it is a profile ->
      //           sync it.
      //           if our application is also the owner ->
      //             store it in the chat profiles variable.
      //             stop looping.
      //           if not store it in a temp collection.
      //           if all revisisons have been synced -> push the top temp profile to the chat profiles variable.
      console.log("fetchProfiles() is complete on Chat2.vue");
    },
    async pollForUpdatesOld() {
      this.poll = setInterval(async () => {
        //first get the latest threads, and send them to the sidebar
        let _revs = await this.computer.getRevs(this.publicKey);
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
            console.log("Getting Profiles");
            console.log("Assigned updated thread after sync");
            if (this.thread.messages !== this.messages) {
              this.updateLoading(true);
              this.getProfiles();
              this.messages = this.thread.messages;
            }
            this.updateLoading(false);
          }
        } else {
          console.log("There is no selectedThread in memory.");
        }
        this.loading = false;
      }, 3000);
    },
    async getProfiles() {
      console.log("Getting Profiles. ");
      if (this.thread) {
        let owners = this.thread._owners;
        owners.map(async o => {
          console.log("Getting revs to find profile for:", o);
          let _revs = await this.computer.getRevs(o);
          _revs.map(async r => {
            let _synced = await this.computer.sync(r);
            if (
              _synced.contractTypeName &&
              _synced.contractTypeName === "UserProfile"
            ) {
              let shouldAdd = true;
              console.log("Found Profile:", _synced);
              if (this.profiles.length === 0) {
                this.profiles.push(_synced);
                console.log("Added the first profile to the list");
              } else {
                //brute force this for now.
                //TODO: filter properly
                this.profiles.forEach(element => {
                  console.log(
                    "Check Profile List for this profile with id:",
                    element._id
                  );
                  if (element._id === _synced._id) {
                    shouldAdd = false;
                    console.log("This profile already exists in the list");
                  }
                });
              }
              if (shouldAdd) {
                console.log("Addded an additional profile to the list");
                this.profiles.push(_synced);
                this.updateMessages([]);
              }
            }
          });
        });
      }
    },
    async createNewChatThread(chatTitle, to, pk) {
      this.pausePolling = true;
      this.updateLoading(true);
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
      this.pausePolling = false;
      this.showNewChat = false;
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
          returnClass = "pt-5 pb-3 pl-3 pr-3 bg-white rounded overflow-y-auto";
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
