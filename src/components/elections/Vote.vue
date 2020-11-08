<template>
  <div class="rounded shadow-lg outline-primary bg-white mx-1 px-1 ">
    <div class="flex flex-col m-1 p-1">
      <i class="fas fa-vote-yea fa-2x" aria-hidden="true"></i>
      <p class="text-xl">{{ vote.title }}</p>
      <p class="text-md">Cast Your Vote For:</p>
      <div class="flex">
        <div class="shadow-md w-full px-1 py-1">
          <p>{{ vote.can1name }}</p>
          <button
            @click.prevent="sendVote(vote, 1)"
            class="btn bg-gray-700 w-full text-white rounded-none rounded-b-lg"
          >
            Vote
          </button>
        </div>
        <div class="shadow-md w-full px-1 py-1">
          <p>{{ vote.can2name }}</p>
          <button
            @click.prevent="sendVote(vote, 2)"
            class="btn bg-gray-700 w-full text-white rounded-none rounded-b-lg"
          >
            Vote
          </button>
        </div>
        <div class="shadow-md w-full px-1 py-1">
          <p>{{ vote.can3name }}</p>
          <button
            @click.prevent="sendVote(vote, 3)"
            class="btn bg-gray-700 w-full text-white rounded-none rounded-b-lg"
          >
            Vote
          </button>
        </div>
      </div>
    </div>
    <div v-if="notificationOpen">
      <div
        :class="
          `modal ${!notificationOpen &&
            'opacity-0 pointer-events-none'} z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`
        "
      >
        <div
          class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
        ></div>

        <div
          class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto"
        >
          <div
            class="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50"
          >
            <svg
              class="fill-current text-white"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <path
                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
              />
            </svg>
            <span class="text-sm">(Esc)</span>
          </div>

          <!-- Add margin if you want to see some of the overlay behind the modal-->
          <div class="modal-content py-4 text-left px-6">
            <!--Title-->
            <div class="flex justify-between items-center pb-3">
              <p class="text-2xl font-bold">Congratulations, You Voted!</p>
              <div
                class="modal-close cursor-pointer z-50"
                @click="notificationOpen = false"
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
            <p>{{ notificationMessage }}</p>

            <!--Footer-->
            <div class="flex justify-end pt-2">
              <button
                @click="notificationOpen = false"
                class="px-6 py-3 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2"
              >
                Close
              </button>
              <!-- <button
                @click="notificationOpen = false"
                class="px-6 py-3 bg-indigo-600 rounded-md text-white font-medium tracking-wide hover:bg-indigo-500"
              >
                Action
              </button> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, ref } from "vue";
import * as PIConstants from "./../../constants/ProvideInjectConstants.js";
import FileUtils from "./../../utilities/FileUtils.js";
export default {
  setup(props) {
    const computer = inject(PIConstants.COMPUTER);
    const pausePolling = inject(PIConstants.PAUSE_POLLING_FUNCTION);
    const notificationOpen = ref(false);
    const notificationMessage = ref(false);
    const publicKey = computer.db.wallet.getPublicKey().toString();
    return {
      computer,
      notificationOpen,
      notificationMessage,
      props,
      pausePolling,
      publicKey
    };
  },
  methods: {
    async sendVote(vote, candidateId) {
      this.pausePolling(true);
      let tx = "";
      console.log("Vote", vote);
      let voteRev = await this.computer.getLatestRev(vote._id);
      console.log("VoteRev", voteRev);
      let _vote = await this.computer.sync(voteRev);
      let _receipt = null;
      const RECEIPT = await FileUtils.importFromPublic("vote-receipt.js");
      if (candidateId === 1) {
          console.log("Public Key For receipt:", this.publicKey);
        let _receipt = await this.computer.new(RECEIPT, [this.publicKey]);
        tx = await _vote.voteA();
        _receipt = await this.computer.sync(_receipt._id);
        console.log(_vote._rootId, _vote.title, _vote.can1name, _vote.cand1PK);
        await _receipt.finalizeReceipt(
          _vote._rootId,
          _vote.title,
          _vote.can1name,
          _vote.cand1PK
        );
      }
      if (candidateId === 2) {
        let _receipt = await this.computer.new(RECEIPT, [this.publicKey]);
        tx = await _vote.voteB();
        _receipt = await this.computer.sync(_receipt._id);
        console.log(_vote._rootId, _vote.title, _vote.can2name, _vote.cand2PK);
        _receipt.finalizeReceipt(
          _vote._rootId,
          _vote.title,
          _vote.can2name,
          _vote.cand2PK
        );
      }
      if (candidateId === 3) {
        let _receipt = await this.computer.new(RECEIPT, [this.publicKey]);
        tx = await _vote.voteC();
        _receipt = await this.computer.sync(_receipt._id);
        console.log(_vote._rootId, _vote.title, _vote.can3name, _vote.cand3PK);
        _receipt.finalizeReceipt(
          _vote._rootId,
          _vote.title,
          _vote.can3name,
          _vote.cand3PK
        );
      }
      this.notificationOpen = false;
      this.notificationMessage =
        "Your Vote has been sent. You can check it on chain";
      this.notificationOpen = true;
      console.log(tx, _receipt);
      this.pausePolling(false);
    }
  },
  props: ["vote"]
};
</script>

<style lang="scss" scoped></style>
