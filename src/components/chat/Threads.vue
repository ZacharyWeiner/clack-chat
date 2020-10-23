<template>
  <div>
    {{tControlThreadID}}
    <div :v-if="revs && revs.length > 0">
      <div v-for="rev in revs" :key="rev">
        <button @click.prevent="viewChat(rev)" :class="buttonClass">
          {{ rev.substring(0, 4) }} ...
          {{ rev.substring(rev.length - 6, rev.length) }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, inject } from "vue";
export default {
  name: "Threads",
  async setup(props) {
    const tControlThreadID = inject("thread_id", "");

    console.log("Props for Threads", tControlThreadID);
    if (tControlThreadID) {
      console.log("ThreadID:", tControlThreadID);
    }
    const pubKey = props.computer.db.wallet.getPublicKey();
    let _revs = await props.computer.getRevs(pubKey);
    let revs = ref(_revs);
    console.log(revs);
    return { revs, tControlThreadID };
  },
  methods: {
    viewChat(rev) {
      console.log("clicked with rev");
      try {
        this.$router.push({ name: "ChatThread", params: { thread_id: rev } });
      } catch (err) {
        alert(err);
      }
    },
    buttonClass(_rev) {
      if (this.rev === _rev) return "bg-blue-500";
    }
  },
  props: ["thread", "computer"]
};
</script>
<style scoped></style>
