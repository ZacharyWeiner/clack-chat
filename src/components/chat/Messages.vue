<template>
  <div>
    <!-- <div v-if="!!messages && messages.length > 0">
      Messages is greater than 0
      {{
        messages.map(m => {
          return m.toString();
        })
      }}
    </div> -->
    <div>
      New Message
      <div :v-if="showNewMessageBox">
        Show New
        <!-- <SendMessage :computer="getComputer" :thread="threadID" /> -->
      </div>
    </div>
  </div>
</template>
<script>
//import { ref } from "vue";
import Computer from "bitcoin-computer";
import * as Constants from "./../../constants/LocalStorageConstants.js";
//import SendMessage from "./SendMessage";
export default {
  async setup(props) {
    const computer = new Computer({
      chain: "BSV",
      network: "testnet",
      seed: window.localStorage.getItem(Constants.SEED)
    });
    try {
      let jThread = await computer.sync(props.thread);
      console.log("props thead on messages:", jThread);
    } catch (err) {
      console.log(err);
    }
    return { computer };
  },
  components: {
    //SendMessage
  },
  computed: {
    showNewMessageBox() {
      if (this.$props.thread) {
        return true;
      }
      return false;
    },
    threadID() {
      console.log("New Message Thread ID:", this.$props.thread);
      return this.$props.thread;
    }
  },
  props: ["thread"]
};
</script>
<style scoped></style>
