<template>
  <Suspense>
    <template #default>
      <div>
        <slot />
      </div>
    </template>
    <template #loading>
      <div>
        Loading...
      </div>
    </template>
  </Suspense>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  setup() {},
  components: {},
  mounted() {
    // if (this.$route.params.id) {
    //   this.updateSelectedThread(this.$route.params.id);
    //   console.log(
    //     "Updating Selected Thread From URL on Chat Layout:",
    //     this.selectedThread.value
    //   );
    // }
  }
});
</script>
