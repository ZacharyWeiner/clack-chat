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
              {{ revList }}
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
    const updateRevList = (_revList) => {
      revList.value = _revList;
    }
    provide("revList", revList);
    provide("updateRevList", updateRevList);
    return { revList };
  },
  components: {
    Header,
    Sidebar
  }
});
</script>
