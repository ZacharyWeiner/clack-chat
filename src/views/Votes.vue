<template>
  <Suspense>
    <template #default>
      <div class="flex h-screen bg-gray-200 font-roboto">
        <Sidebar />
        <div class="flex-1 flex flex-col">
          <Header />
          <main class="flex-1 overflow-y-auto bg-gray-200">
            <div class="container mx-auto px-6 py-8">
              <span class="pl-6 text-3xl mt-2 pt-2 mb-2 pb-2 text-indigo-800">
                My Voting Record
              </span>
              <div
                v-for="vote in votes"
                :key="vote._id"
                class="bg-white shadow-md w-full mb-2"
              >
                <div class="flex">
                  <div class="mt-2 pt-2 pl-2 text-md w-full">
                    <i
                      class="fas fa-vote-yea text-indigo-500"
                      aria-hidden="true"
                    ></i>
                    {{ vote.electionTitle }}
                  </div>
                  <div class="pr-4 mr-4">
                    {{ new Date(vote.createdOn).toLocaleDateString() }}
                  </div>
                </div>
                <div class="mt-2 pt-2 pb-2 pl-10 text-xl text-gray-700">
                  <div class="">
                    <i
                      class="far fa-check-square text-green-500 pr-3"
                    ></i
                    >{{ vote.candidateName }}
                  </div>
                </div>
              </div>
              <div v-if="loading">
                <LoadingPanel />
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
import { defineComponent, ref } from "vue";
import Sidebar from "@/components/elections/Sidebar.vue";
import Header from "@/components/elections/Header.vue";
import Computer from "bitcoin-computer";
import * as LSConstants from "./../constants/LocalStorageConstants.js";
import LoadingPanel from "./../components/LoadingPanel";

export default defineComponent({
  async setup() {
    const loading = ref(true);
    const votes = ref([]);
    const computer = new Computer({
      seed: window.localStorage.getItem(LSConstants.SEED),
      network: window.localStorage.getItem(LSConstants.NETWORK),
      chain: window.localStorage.getItem(LSConstants.CHAIN)
    });
    return { computer, votes, loading };
  },
  beforeUnmount() {
    clearInterval(this.poll);
  },
  mounted() {
    this.startPolling();
  },
  data: function() {
    return {
      poll: null
    };
  },
  components: {
    Header,
    Sidebar,
    LoadingPanel
  },
  methods: {
    startPolling() {
      this.poll = setInterval(async () => {
        let revs = await this.computer.getRevs(
          this.computer.db.wallet.getPublicKey()
        );
        let _temp = [];
        await Promise.all(
          revs.map(async rev => {
            let _smartObject = await this.computer.sync(rev);
            if (
              _smartObject.contractTypeID ===
              "388ed8f2-85e8-40a3-9165-3c256adfa32f"
            ) {
              _temp.push(_smartObject);
            }
          })
        );
        this.votes = _temp;
        this.loading = false;
      }, 3000);
    }
  }
});
</script>

<style lang="scss" scoped></style>
