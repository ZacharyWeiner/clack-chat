<template>
  <Suspense>
    <template #default>
      <div class="flex h-screen bg-gray-200 font-roboto">
        <Sidebar />
        <div class="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
            <div class="container mx-auto px-6 py-8">
              <slot />
            </div>
          </main>
        </div>
      </div>
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script>
import { defineComponent, provide, ref } from "vue";
import Header from "./Header.vue";
import Sidebar from "./Sidebar.vue";

export default defineComponent({
  setup() {
    const revList = ref(["nothing yet"]);
    const selectedThread = ref("");

    const updateRevList = _revList => {
      revList.value = _revList;
      console.log("Rev List Length:", revList.value);
    };

    const updateSelectedThread = _id => {
      window.localStorage.setItem("SelectedThread", _id);
      selectedThread.value = _id;
      console.log("Updated Selected Thread From Sidebar:", _id);
    };

    provide("revList", revList);
    provide("selectedThread", selectedThread);
    provide("updateSelectedThread", updateSelectedThread);
    provide("updateRevList", updateRevList);
    return { revList, selectedThread, updateRevList, updateSelectedThread };
  },
  components: {
    Header,
    Sidebar
  },
  mounted() {
    if (this.$route.params.id) {
      this.updateSelectedThread(this.$route.params.id);
      console.log(
        "Updating Selected Thread From URL on Chat Layout:",
        this.selectedThread.value
      );
    }
  }
});
</script>
