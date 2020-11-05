<template>
  <div>
    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg text-gray-700 font-semibold capitalize">
          Create An Election
        </h2>

        <form @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div>
              <label class="text-gray-700" for="title">Election Title</label>
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="text"
                v-model="title"
              />
            </div>

            <div>
              <label class="text-gray-700" for="votes">Total Votes</label>
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="number"
                v-model="votes"
              />
            </div>

            <div>
              <label class="text-gray-700" for="candidate"
                >Name Of Candidate</label
              >
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="text'"
                v-model="candidate1Name"
              />
            </div>

            <div>
              <label class="text-gray-700" for="passwordConfirmation"
                >Candidate's Public Key</label
              >
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="text'"
                v-model="candidate1PublicKey"
              />
            </div>

            <div>
              <label class="text-gray-700" for="candidate"
                >Name Of Candidate</label
              >
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="text'"
                v-model="candidate2Name"
              />
            </div>

            <div>
              <label class="text-gray-700" for="passwordConfirmation"
                >Candidate's Public Key</label
              >
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="text'"
                v-model="candidate2PublicKey"
              />
            </div>

            <div>
              <label class="text-gray-700" for="candidate"
                >Name Of Candidate</label
              >
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="text'"
                v-model="candidate3Name"
              />
            </div>

            <div>
              <label class="text-gray-700" for="passwordConfirmation"
                >Candidate's Public Key</label
              >
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="text'"
                v-model="candidate3PublicKey"
              />
            </div>
          </div>

          <div class="flex justify-end mt-4">
            <button
              class="px-4 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import FileUtils from "./../../utilities/FileUtils.js";
import Computer from "bitcoin-computer";
import * as LSConstants from "@/constants/LocalStorageConstants.js";
export default {
  setup(props) {
    const votes = ref(0);
    const title = ref("");
    const election = ref(null);
    const creating = ref(false);
    const candidate1Name = ref("");
    const candidate2Name = ref("");
    const candidate3Name = ref("");
    const candidate1PublicKey = ref("");
    const candidate2PublicKey = ref("");
    const candidate3PublicKey = ref("");
    // eslint-disable-next-line vue/no-setup-props-destructure

    return {
      props,
      votes,
      title,
      election,
      creating,
      candidate1Name,
      candidate2Name,
      candidate3Name,
      candidate1PublicKey,
      candidate2PublicKey,
      candidate3PublicKey
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const publicKey = await this.props.computer.db.wallet
          .getPublicKey()
          .toString();
        console.log("Public Key: " + publicKey);
        const ELECTION = await FileUtils.importFromPublic("election.js");
        console.log(
          "Election variables before create \n",
          publicKey,
          publicKey,
          this.title,
          parseInt(this.votes, 10),
          this.candidate1Name,
          this.candidate1PublicKey,
          this.candidate2Name,
          this.candidate2PublicKey,
          this.candidate3Name,
          this.candidate3PublicKey
        );
        const _computer = new Computer({
          seed: window.localStorage.getItem(LSConstants.SEED),
          network: window.localStorage.getItem(LSConstants.NETWORK),
          chain: window.localStorage.getItem(LSConstants.CHAIN)
        });
        console.log(`Created Election From File \n ${ELECTION}`);
        let _election = await _computer.new(ELECTION, [
          publicKey,
          publicKey,
          this.title,
          parseInt(this.votes, 10),
          this.candidate1Name,
          this.candidate1PublicKey,
          this.candidate2Name,
          this.candidate2PublicKey,
          this.candidate3Name,
          this.candidate3PublicKey
        ]);
        console.log("created Election on the blockchain. ");
        this.election = _election;
        console.log("creating election complete");
        console.log(_election);
        console.log(
          "Successfully created " + _election.votes + "for " + _election.name
        );
      } catch (err) {
        if (err.message.startsWith("Insufficient balance in address")) {
          alert(
            `You need testnet coins to mint a token. To get free testnet coins open the your wallet.`
          );
        } else {
          alert(err);
        }
      }
    }
  },
  props: ["computer"]
};
</script>

<style scoped></style>
