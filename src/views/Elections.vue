<template>
  <Suspense>
    <template #default>
      <div class="flex h-screen bg-gray-200 font-roboto">
        <Sidebar />
        <div class="flex-1 flex flex-col">
          <Header :title="title" />
          <main class="flex-1 overflow-y-auto bg-gray-200">
            <div v-if="loading">
              <LoadingPanel />
            </div>
            <button
              class="btn btn-primary mt-1 ml-1"
              @click="showMint = !showMint"
            >
              {{ mintButtonText }}
            </button>
            <Mint v-if="showMint" :computer="computer" />
            <div class="container mx-auto px-6 py-8">
              <div class="flex">
                <div class="w-1/4 overflow-y-auto">
                  <div v-for="votes in groupedVotes" :key="votes[0]._id">
                    <div v-if="votes[0].distributor === this.publicKey">
                      <Distribute :vote="votes[0]" />
                    </div>
                  </div>
                </div>
                <div class="w-3/4">
                  <div v-for="votes in groupedVotes" :key="votes[0]._id">
                    <div v-if="votes[0].distributor !== this.publicKey">
                      <Vote :vote="votes[0]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <NotificationModal
          :isOpen="notificationOpen"
          :message="notificationMessage"
        />
      </div>
    </template>
    <template #loading>
      Loading ...
    </template>
  </Suspense>
</template>

<script>
import { provide, ref, defineComponent } from "vue";
import Sidebar from "@/components/elections/Sidebar.vue";
import Header from "@/components/elections/Header.vue";
import Mint from "@/components/elections/Mint.vue";
//import VoteWallet from "@/components/elections/VoteWallet.vue";
import Computer from "bitcoin-computer";
import * as LSConstants from "@/constants/LocalStorageConstants.js";
import * as PIConstants from "@/constants/ProvideInjectConstants.js";
import LoadingPanel from "@/components/LoadingPanel";

import NotificationModal from "@/components/elections/NotificationModal.vue";
import Distribute from "./../components/elections/Distribute";
import Vote from "./../components/elections/Vote";
export default defineComponent({
  async setup() {
    const pausePolling = ref(false);
    const loading = ref(false);
    const notificationOpen = ref(false);
    const notificationMessage = ref("");
    const publicKey = ref("");
    const address = ref("");
    const balance = ref("");
    const objects = ref([]);
    const title = ref("Elections");
    const showMint = ref(false);
    const groupedVotes = ref(null);
    const voterPublicKey = ref("");
    const computer = new Computer({
      seed: window.localStorage.getItem(LSConstants.SEED),
      network: window.localStorage.getItem(LSConstants.NETWORK),
      chain: window.localStorage.getItem(LSConstants.CHAIN)
    });

    const updatePausePolling = _val => {
      updatePausePolling.value = _val;
    };
    provide(PIConstants.PAUSE_POLLING_FUNCTION, updatePausePolling);
    provide(PIConstants.COMPUTER, computer);

    let a = await computer.db.wallet.getAddress().toString();
    address.value = a;
    let b = await computer.db.wallet.getBalance();
    balance.value = b;
    console.log("async initializing the  default computer");
    let pk = await computer.db.wallet.getPublicKey().toString();
    publicKey.value = pk;

    const groupByRoot = list =>
      list.reduce(
        (acc, obj) => ({
          ...acc,
          [obj["_rootId"]]: (acc[obj["_rootId"]] || []).concat(obj)
        }),
        {}
      );
    return {
      pausePolling,
      loading,
      computer,
      publicKey,
      address,
      balance,
      objects,
      title,
      groupByRoot,
      showMint,
      groupedVotes,
      voterPublicKey,
      notificationOpen,
      notificationMessage
    };
  },
  components: {
    Header,
    Sidebar,
    LoadingPanel,
    Mint,
    NotificationModal,
    Distribute,
    Vote
    //VoteWallet
  },
  async mounted() {
    console.log("mounted() called on Elections.vue");
    //Redirect back to home if no Seed is found
    if (!window.localStorage.getItem(LSConstants.SEED)) {
      this.$router.push("/login");
    }
    //otherwise - start polling for new messages.
    this.loading = true;
    this.startPolling();
  },
  beforeUnmount() {
    console.log("beforeUnmount() called on Elections.vue");
    clearInterval(this.poll);
  },
  data: function() {
    return {
      poll: null
    };
  },
  computed: {
    mintButtonText() {
      if (this.showMint) return "X Close";
      return "+ Create An Election";
    }
  },
  methods: {
    startPolling() {
      this.poll = setInterval(async () => {
        if (this.computer && !this.pausePolling) {
          const revs = await this.computer.getRevs(this.publicKey);
          console.log(revs);
          let objs = [];
          await Promise.all(
            revs.map(async rev => {
              let _smartObject = await this.computer.sync(rev);
              console.log(_smartObject);
              if (_smartObject["contractTypeID"]) {
                if (
                  _smartObject.contractTypeID ===
                  "f7469129-5ea8-44ef-8860-1ed6687000b9"
                ) {
                  return objs.push(_smartObject);
                }
              }
            })
          );
          console.log(objs);
          this.objects = objs;
          this.groupedVotes = this.groupByRoot(objs);
          this.loading = false;
        }
      }, 5000);
    },
    async distributeVote(vote) {
      this.pausePolling = true;
      console.log(vote.can1name);
      console.log(
        `Distributing vote for election ${vote.title} to ${this.voterPublicKey}`
      );
      let lr = await this.computer.getLatestRev(vote._id);
      let election = await this.computer.sync(lr);
      let tx = await election.distribute(this.voterPublicKey);
      this.notificationOpen = null;
      this.notificationMessage = "Distributed 1 vote to " + this.voterPublicKey;
      this.notificationOpen = true;
      console.log(tx);
      this.pausePolling = false;
      return tx;
    }
    
  }
});
</script>

<style lang="scss" scoped></style>
