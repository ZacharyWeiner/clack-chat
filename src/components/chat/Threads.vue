<template>
  <div>
    <div :v-if="revs && revs.length > 0">
      <div v-for="rev in revs" :key="rev">{{ rev }}</div>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import Computer from "bitcoin-computer";
import * as Constants from "./../../constants/LocalStorageConstants.js";
export default {
  name: "Threads",
  async setup(props) {
    console.log("Props for Threads", props);
    if (props.thread) {
      console.log("ThreadID:", props.thread);
    }
    const _computer = new Computer({
      chain: "BSV",
      network: "testnet",
      seed: window.localStorage.getItem(Constants.SEED)
    });
    const computer = _computer;
    const pubKey = computer.db.wallet.getPublicKey();
    let _revs = await computer.getRevs(pubKey);
    let revs = ref(_revs);

    console.log(revs);
    return { revs };
  },
  props: ["thread"]
};
</script>
<style scoped></style>
