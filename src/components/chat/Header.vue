<template>
  <h3 class="text-gray-700 text-3xl font-medium">Address: {{ address }}</h3>
</template>
<script>
import Computer from "bitcoin-computer";
import * as Constants from "@/constants/LocalStorageConstants.js";
//import FileUtils from "@/utilities/FileUtils.js";
export default {
  name: "Header",
  async setup() {
    const _computer = new Computer({
      chain: "BSV",
      network: "testnet",
      seed: window.localStorage.getItem(Constants.SEED)
    });
    const computer = _computer;
    const address = computer.db.wallet.getAddress().toString();
    // const pubKey = computer.db.wallet.getPublicKey().toString();
    // let _contract = await FileUtils.importFromPublic("chat-thread.js");
    // let thread = await computer.new(_contract, [
    //   pubKey,
    //   "clack.chat",
    //   "Some Thread"
    // ]);
    // console.log(thread);
    return { address };
  }
};
</script>
<style scoped></style>
