<template>
  <Suspense>
    <template #default>
      <div>
        <div>
          {{ first.title }}
        </div>
      </div>
    </template>
    <template #loading>
      <div>Loading ...</div>
    </template>
  </Suspense>
</template>

<script>
import { ref } from "vue";
export default {
  async setup(props) {
    const first = ref(null);
    first.value = props.votes ? props.votes[0] : null;
    console.log("Votes First Position:", props.votes[0]);
    if (props.votes) {
      console.log("Votes at vote wallet:", props.votes);
    }
    const publicKey = await props.computer.db.wallet.getPublicKey();
    const candidate1Click = async () => {
      try {
        let tx = await first.value.voteA(publicKey);
        console.log(tx);
      } catch (err) {
        alert(err);
      }
    };

    const candidate2Click = async () => {
      let tx = await first.value.voteB(publicKey);
      console.log(tx);
    };

    const candidate3Click = async () => {
      let tx = await first.value.voteC(publicKey);
      console.log(tx);
    };

    return { first, candidate1Click, candidate2Click, candidate3Click };
  },
  props: ["computer", "votes"]
};
</script>

<style lang="scss" scoped></style>
