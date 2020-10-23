<template>
  <Suspense>
    <template #default>
      <div class="flex h-screen bg-gray-200 font-roboto">
        <div class="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
            <div class=" mx-auto px-6 py-8">
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
import { defineComponent } from "vue";
import Header from "./Header.vue";

export default defineComponent({
  components: {
    Header
  }
});
</script>
