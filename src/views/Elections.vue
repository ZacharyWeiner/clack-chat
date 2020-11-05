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
                      <div class="rounded shadow-lg outline-primary bg-white ">
                        <div class="m-1 p-1">
                          <i
                            class="fas fa-vote-yea fa-2x"
                            aria-hidden="true"
                          ></i>
                          <p class="text-xl">{{ votes[0].title }}</p>
                        </div>
                        <div class="pl-1 ml-1"> <router-link :to="`/elections/${votes[0]._id}`"> View Results </router-link> </div>
                        <div class="m-1 pt-1 rounded-bottom text-xs w-full">
                          Send Vote To PublicKey
                        </div>
                        <div class="flex">
                          <input
                            class="form-input w-full rounded-md border-indigo-300 focus:border-indigo-600 overflow-y-none"
                            type="text'"
                            v-model="voterPublicKey"
                            placeholder="98cXytbc....."
                          />
                        </div>
                        <div class="flex justify-end w-full pt-1 ">
                          <button
                            class="btn btn-primary w-full rounded-none rounded-b-lg"
                            @click.prevent="distributeVote(votes[0])"
                          >
                            Distribute
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="w-3/4">
                  <div v-for="votes in groupedVotes" :key="votes[0]._id">
                    <div v-if="votes[0].distributor !== this.publicKey">
                      <div
                        class="rounded shadow-lg outline-primary bg-white mx-1 px-1 "
                      >
                        <div class="flex flex-col m-1 p-1">
                          <i
                            class="fas fa-vote-yea fa-2x"
                            aria-hidden="true"
                          ></i>
                          <p class="text-xl">{{ votes[0].title }}</p>
                          <p class="text-md">Cast Your Vote For:</p>
                          <div class="flex">
                            <div class="shadow-md w-full px-1 py-1">
                              <p>{{ votes[0].can1name }}</p>
                              <button
                                @click.prevent="sendVote(votes[0], 1)"
                                class="btn bg-gray-700 w-full text-white rounded-none rounded-b-lg"
                              >
                                Vote
                              </button>
                            </div>
                            <div class="shadow-md w-full px-1 py-1">
                              <p>{{ votes[0].can2name }}</p>
                              <button
                                @click.prevent="sendVote(votes[0], 2)"
                                class="btn bg-gray-700 w-full text-white rounded-none rounded-b-lg"
                              >
                                Vote
                              </button>
                            </div>
                            <div class="shadow-md w-full px-1 py-1">
                              <p>{{ votes[0].can3name }}</p>
                              <button
                                @click.prevent="sendVote(votes[0], 3)"
                                class="btn bg-gray-700 w-full text-white rounded-none rounded-b-lg"
                              >
                                Vote
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </template>
    <template #loading>
      Loading ...
    </template>
  </Suspense>
</template>

<script>
import { ref, defineComponent } from "vue";
import Sidebar from "@/components/elections/Sidebar.vue";
import Header from "@/components/elections/Header.vue";
import Mint from "@/components/elections/Mint.vue";
//import VoteWallet from "@/components/elections/VoteWallet.vue";
import Computer from "bitcoin-computer";
import * as LSConstants from "@/constants/LocalStorageConstants.js";
import LoadingPanel from "@/components/LoadingPanel";
export default defineComponent({
  async setup() {
    const pausePolling = ref(false);
    const loading = ref(false);
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
      voterPublicKey
    };
  },
  components: {
    Header,
    Sidebar,
    LoadingPanel,
    Mint
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
      console.log(tx);
      this.pausePolling = false;
      return tx;
    },
    async sendVote(vote, candidateId) {
      let tx = "";
      let voteRev = await this.computer.getLatestRev(vote._id);
      let _vote = await this.computer.sync(voteRev);
      if (candidateId === 1) {
        tx = await _vote.voteA();
      }
      if (candidateId === 2) {
        tx = await _vote.voteB();
      }
      if (candidateId === 3) {
        tx = await _vote.voteC();
      }
      console.log(tx);
    }
  }
});
</script>

<style lang="scss" scoped></style>
