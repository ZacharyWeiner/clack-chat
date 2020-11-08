<template>
  <Suspense>
    <template #default>
      <div class="flex h-screen bg-gray-200 font-roboto">
        <Sidebar />
        <div class="flex-1 flex flex-col">
          <Header />
          <main class="flex overflow-y-auto bg-gray-200">
            <div class="container w-full mx-auto px-6 py-8">
              <span class="text-xl text-gray-700"> Results For: </span> <br />
              <span class="text-3xl text-indigo-800">
                {{ election ? election.title : "" }}
              </span>
              <div v-if="election" class="flex text-center">
                <div
                  class="candidateContainer w-full bg-white outline rounded shadow-md m-1 p-1"
                >
                  <p class="text-xl primary p-2 m-2">{{ election.can1name }}</p>
                  <hr />
                  Total Votes: <br />
                  <div
                    v-for="grouping in candidate1group"
                    :key="grouping._root_id"
                  >
                    {{ grouping.length }}
                  </div>
                  <div v-for="rev in _can1revs" :key="rev">
                    <a
                      :href="`https://test.whatsonchain.com/tx/${rev.split(':')[0]}`"
                      target="_blank"
                    >
                      view on chain {{ rev.substring(0, 10) }}... 
                    </a>
                  </div>
                </div>
                <div
                  class="candidateContainer w-full bg-white outline rounded shadow-md m-1 p-1"
                >
                  <p class="text-xl primary p-2 m-2">{{ election.can2name }}</p>
                  <hr />
                  Total Votes: <br />
                  <div
                    v-for="grouping in candidate2group"
                    :key="grouping._root_id"
                  >
                    {{ grouping.length }}
                  </div>
                   <div v-for="rev in _can2revs" :key="rev">
                    <a
                      :href="`https://test.whatsonchain.com/tx/${rev.split(':')[0]}`"
                      target="_blank"
                    >
                      view on chain {{ rev.substring(0, 10) }}... 
                    </a>
                  </div>
                </div>
                <div
                  class="candidateContainer w-full bg-white outline rounded shadow-md m-1 p-1"
                >
                  <p class="text-xl primary p-2 m-2">{{ election.can3name }}</p>
                  <hr />
                  Total Votes: <br />
                  <div
                    v-for="grouping in candidate3group"
                    :key="grouping._root_id"
                  >
                    {{ grouping.length }}
                  </div>
                   <div v-for="rev in _can3revs" :key="rev">
                    <a
                      :href="`https://test.whatsonchain.com/tx/${rev.split(':')[0]}`"
                      target="_blank"
                    >
                      view on chain {{ rev.substring(0, 10) }}...
                    </a>
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
import Header from "@/components/Header.vue";
import Computer from "bitcoin-computer";
import * as LSConstants from "@/constants/LocalStorageConstants.js";
export default defineComponent({
  async setup() {
    const election = ref(null);
    const _can1revs = ref([]);
    const _can2revs = ref([]);
    const _can3revs = ref([]);
    const candidate1Name = ref("");
    const candidate1PublicKey = ref("");
    const candidate2Name = ref("");
    const candidate2PublicKey = ref("");
    const candidate3Name = ref("");
    const candidate3PublicKey = ref("");
    const candidate1Objects = ref(null);
    const candidate2Objects = ref(null);
    const candidate3Objects = ref(null);

    const computer = new Computer({
      seed: window.localStorage.getItem(
        "cactus shallow crack teach tumble shove surge mercy place vivid cash hire"
      ),
      network: window.localStorage.getItem(LSConstants.NETWORK),
      chain: window.localStorage.getItem(LSConstants.CHAIN)
    });

    const groupByRoot = list =>
      list.reduce(
        (acc, obj) => ({
          ...acc,
          [obj["_rootId"]]: (acc[obj["_rootId"]] || []).concat(obj)
        }),
        {}
      );

    return {
      computer,
      election,
      _can1revs,
      _can2revs,
      _can3revs,
      candidate1Name,
      candidate1PublicKey,
      candidate2Name,
      candidate2PublicKey,
      candidate3Name,
      candidate3PublicKey,
      groupByRoot,
      candidate1Objects,
      candidate2Objects,
      candidate3Objects
    };
  },
  components: {
    Header,
    Sidebar
  },
  data: function() {
    return {
      poll: null
    };
  },
  mounted() {
    console.log("Election Results Are Mounting.");
    this.fetchInitialState();
    this.startPolling();
  },
  computed: {
    candidate1group() {
      if (this.candidate1Objects && this.candidate1Objects.length > 0)
        return this.groupByRoot(this.candidate1Objects);
      return [];
    },
    candidate2group() {
      if (this.candidate2Objects && this.candidate2Objects.length > 0)
        return this.groupByRoot(this.candidate2Objects);
      return [];
    },
    candidate3group() {
      if (this.candidate3Objects && this.candidate3Objects.length > 0)
        return this.groupByRoot(this.candidate3Objects);
      return [];
    }
  },
  methods: {
    async fetchInitialState() {
      let electionId = this.$route.params.id;
      console.log(electionId);
      let lr = await this.computer.getLatestRev(electionId);
      this.election = await this.computer.sync(lr);
      this.candidate1Name = this.election.can1name;
      this.candidate1PublicKey = this.election.cand1PK;
      this.candidate2Name = this.election.can2name;
      this.candidate2PublicKey = this.election.cand2PK;
      this.candidate3Name = this.election.can3name;
      this.candidate3PublicKey = this.election.cand3PK;
    },
    async startPolling() {
      this.poll = setInterval(async () => {
        if (this.election) {
          this._can1revs = await this.computer.getRevs(this.election.cand1PK);
          console.log(this._can1revs);
          let _temp1 = [];
          await Promise.all(
            this._can1revs.map(async rev => {
              console.log("Syncing candidate 1 vote");
              let synced = await this.computer.sync(rev);
              console.log("End Sync candidate 1 vote");
              if (synced._rootId === this.election._rootId) {
                _temp1.push(synced);
              }
            })
          );
          this.candidate1Objects = _temp1;

          this._can2revs = await this.computer.getRevs(this.election.cand2PK);
          let _temp2 = [];
          console.log(this._can2revs);
          await Promise.all(
            this._can2revs.map(async rev => {
              console.log("Syncing candidate 2 vote");
              let synced = await this.computer.sync(rev);
              console.log("End Sync candidate 2 vote");
              if (synced._rootId === this.election._rootId) {
                _temp2.push(synced);
              }
            })
          );

          this.candidate2Objects = _temp2;

          this._can3revs = await this.computer.getRevs(this.election.cand3PK);
          let _temp3 = [];
          console.log(this._can1revs);
          await Promise.all(
            this._can3revs.map(async rev => {
              console.log("Syncing candidate 3 vote");
              let synced = await this.computer.sync(rev);
              console.log("End Sync candidate 3 vote");
              if (synced._rootId === this.election._rootId) {
                _temp3.push(synced);
              }
            })
          );

          this.candidate3Objects = _temp3;
          _temp3 = [];
          //
        }
      }, 5000);
    }
  }
});
</script>

<style lang="scss" scoped></style>
