<template>
  <Suspense>
    <template #default>
      <div class="flex h-screen bg-gray-200 font-roboto">
        <Sidebar />
        <div class="flex-1 flex flex-col">
          <Header />
          <main class="flex-1 overflow-y-auto bg-gray-200">
            <div class="container mx-auto px-6 py-8">Votes</div>
          </main>
        </div>
      </div>
    </template>
    <template #loading>
      Loading ...
    </template>
  </Suspense>
</template>

<script>
import { defineComponent } from "vue";
import Sidebar from "@/components/elections/Sidebar.vue";
import Header from "@/components/Header.vue";

export default defineComponent({
  components: {
    Header,
    Sidebar
  }
});
</script>

<style lang="scss" scoped></style>
