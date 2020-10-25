<template>
  <div class="flex justify-center items-center w-screen h-screen bg-indigo-100">
    <div
      class="card-body bg-gray-100 rounded-lg shadow-xl flex justify-center py-10 px-6"
     
    >
      <div class="card-details">
        <div class="card-image flex content-center justify-center">
          <img
            class="w-24 rounded-full"
            src="https://pbs.twimg.com/profile_images/1237469986928701440/gDTeFYB5_400x400.jpg"
            alt=""
          />
        </div>
        <h1 class="text-2xl text-gray-700 text-center my-4">
          {{ displayName }}
        </h1>

        <div class="grid justify-center">
          <div
            class="bg-blue-500 text-center font-bold rounded-md text-sm px-4 py-1 text-blue-100"
          >
            Address:
            <p class="text-blue-100 text-center font-normal mb-1 text-lg">
              {{ address }}
            </p>
          </div>
          <div
            class="bg-purple-500 text-center font-bold rounded-md text-sm px-4 py-1 mt-1 text-purple-100"
          >
          Public Key:
          <p class="text-purple-100 text-center font-normal mb-1 text-lg">
            {{ publicKey }}
          </p>
          </div>
          <!-- <div
            class="bg-purple-500 text-center rounded-md text-sm px-4 py-1 text-purple-100"
          >
            HTML
          </div>
          <div
            class="bg-purple-500 text-center rounded-md text-sm px-4 py-1 text-purple-100"
          >
            CSS
          </div>
          <div
            class="bg-purple-500 text-center rounded-md text-sm px-4 py-1 text-purple-100"
          >
            JavaScript
          </div> -->
        </div>
        <a href="/chat" ><i class="fas fa-arrow-circle-left"></i>Back</a>
      </div>
    </div>
  </div>
</template>
<script>
//import { ref } from "vue";
import * as Constants from "./../constants/LocalStorageConstants.js";
import Computer from "bitcoin-computer";
export default {
  setup() {
    let seed = window.localStorage.getItem(Constants.SEED);
    const computer = new Computer({
      network: "testnet",
      chain: "BSV",
      seed: seed
    });
    return { computer };
  },
  computed: {
    displayName() {
      return window.localStorage.getItem(Constants.DISPLAYNAME);
    },
    address() {
      return this.computer.db.wallet.getAddress().toString();
    },
    publicKey() {
      return this.computer.db.wallet.getPublicKey().toString();
    }
  }
};
</script>
<style scoped></style>
