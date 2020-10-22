<template> 
  <h3 class="text-gray-700 text-3xl font-medium">Address: {{ address }}</h3>
</template>
<script>
import Computer from "bitcoin-computer";
import * as Constants from "@/constants/LocalStorageConstants.js";
import FileUtils from "@/utilities/FileUtils.js";
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
    let _contract = await FileUtils.importFromPublic("chat-thread.js");
    console.log(_contract);
    return { address };
  }
};
</script>
<style scoped></style>
