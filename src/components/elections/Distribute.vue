<template>
  <div>
    <div class="rounded shadow-lg outline-primary bg-white ">
      <div class="m-1 p-1">
        <i class="fas fa-vote-yea fa-2x" aria-hidden="true"></i>
        <p class="text-xl">{{ vote.title }}</p>
      </div>
      <div class="pl-1 ml-1">
        <a target="_blank" :href="`/elections/${vote._id}`">
          View Results
        </a>
      </div>
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
          @click.prevent="distributeVote(vote)"
        >
          Distribute
        </button>
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
              <p class="text-2xl font-bold">Distribution of Vote</p>
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
            <p>{{notificationMessage}}</p>

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
export default {
  setup(props) {
    const notificationOpen = ref(false);
    const voterPublicKey = ref("");
    const notificationMessage = ref("Distributed 1 vote to ");
    const pausePolling = inject(PIConstants.PAUSE_POLLING_FUNCTION);
    const computer = inject(PIConstants.COMPUTER);
    return {
      computer,
      notificationOpen,
      notificationMessage,
      props,
      pausePolling,
      voterPublicKey
    };
  },
  methods: {
    async distributeVote(vote) {
      this.pausePolling(true);
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
      this.pausePolling(false);
      return tx;
    }
  },
  props: ["vote"]
};
</script>

<style lang="scss" scoped></style>
