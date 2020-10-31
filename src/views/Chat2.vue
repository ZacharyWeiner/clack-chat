<template>
  <Suspense>
    <template #default>
      <div>
        This page is loaded.
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
import Computer from "bitcoin-computer";
import FileUtils from "@/utilities/FileUtils.js";
import BitcoinComputerUtils from "@/utilities/BitcoinComputerUtils.js";
export default {
  async setup() {
    //Create these as variables to print later,
    //Otherwise just use the getItem method directly
    //to initalize the computer.
    const seed = window.localStorage.getItem(LSConstants.SEED);
    const chain = window.localStorage.getItem(LSConstants.CHAIN);
    const net = window.localStorage.getItem(LSConstants.NETWORK);
    //Use const = Ref ->
    //When if a value change should notify the UI
    //causing an update
    const loading = ref(false);
    const initLoaded = ref(false);
    const showNewChat = ref(false);
    const balance = ref(0);
    const computer = new Computer({
      seed: seed,
      chain: chain,
      network: net
    });
    const pk = ref(computer.db.wallet.getPublicKey().toString());
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
    provide(PIConstants.COMPUTER, computer);
    provide(PIConstants.LOADING_KEY, loading);
    return {
      seed,
      chain,
      net,
      computer,
      loading,
      updateLoading,
      open,
      balance,
      pk,
      showNewChatModal,
      initLoaded
    };
  },
  async mounted() {
    console.log("mounted() called on Chat2.vue");
    //Redirect back to home if no Seed is found
    if (!window.localStorage.getItem(LSConstants.SEED)) {
      this.$router.push("/login");
    }
    //otherwise - mount the component.
    this.updateLoading(true);
    this.fetchInitialState();
  },

  components: {
    LoadingPanel
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
  computed: {},
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
    //Inital state shoudl do all the heavy lifting
    //This way the polling method that runs most often can be light weight.
    async fetchInitialState() {
      console.log("fetchingInitialState() on Chat2.vue");
      //check to see if we have a chat thread ID stored in localStorage.
      //if we do, sync that thread first, and then do everything else
      //If not
      //Get all the revisions from the public Key of the user
      //Store the revisions collection in a variable to be used later in Polling for Updates.
      //One by one, sync all the objects from the revs
      //If the object is a chat-thread -> push it into the chat-threads list
      //If the object is a profile ->
      //Check if there are any profiles in the list for this user already.
      //If not, push this profile into the profiles list.
      //If so, check both profiles for this PK
      //   If one of them has an owner matching our application PK,
      //       store that as the users selected profile in localstorage
      //       &  push that one into the profiles list
      //   If none have assigned this app as an owner, leave the one in the list.
      //When all the smart objects have been synced and filtered.
      //If there is no thread ID in storage assign the most recent chat-thread to the selected thread.
      //In the method that updates the selected thread, assign the messages collection from the selected thread.
      //All threads are synced at this point.
      //Set Loading to False and start polling for updates.
      console.log("Completed fetchingInitialState() on Chat2.vue");
    },
    async pollForUpdates() {
      console.log("pollForUpdates() called on Chat2.vue");
      this.poll = setInterval(async () => {
        console.log("polling from this.poll() =>{setInterval} on Chat2.vue");
        //Get the latest revisions for this users PK
        //If the list is === to the current list of revisions do nothing, the state has not changed.
        //If the list is not === to the current list of revisions.
        //traverse the list of old revsisons and new revisisons, and pull a collection of the new ones.
        //For each new revsison ->
        //  Sync the object
        //  if the object is a chat ->
        //  look for a chat with the same ID in the stored chat-threads list.
        //  If there is one, replace it with the new thread
        //  If it is === to the selected thread
        //    for each message
        //    if message is already in messages collection -> do nothing.
        //    if message is not in the collection -> push it into the collection.
        //  If Not -> push this new chat into the chat-threads list.
        console.log(
          "this.poll() =>{setInterval} iteration complete on Chat2.vue"
        );
      }, 3000);
      this.poll();
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
