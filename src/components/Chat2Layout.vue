<template>
  <Suspense>
    <template #default>
      <div class="flex flex-col h-full">
        <slot />
        <footer class="bottom-0 text-center">
          <div class="w-full  p-4">
            <h1 class="font-bold text-xs text-primary-600">
              Open Source Code On
              <a
                href="https://github.com/ZacharyWeiner/clack-chat"
                target="_blank"
                ><i class="fab fa-github-alt text-md"></i
              ></a>
            </h1>
            <span class="text-xs text-primary-600 text-center">
              Made with ❤️ by
              <a class="underline" href="https://twitter.com/u/developingzack">
                @DevelopingZack
              </a>
              <br />
              Founder:
              <a class="underline" href="http://www.protoshi.co">
                Protoshi.co
              </a>
              <span class="mx-1">| CTO:</span>
              <a class="underline" href="http://www.artisint.com">
                Artis International
              </a>
            </span>
          </div>
        </footer>
      </div>
    </template>
    <template #loading>
      <div>
        <div><i class="fas fa-spinner text-xl"></i>Loading Layout...</div>
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
