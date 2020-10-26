<template>
  <div class="flex">
    <!-- Backdrop -->
    <div
      :class="isOpen ? 'block' : 'hidden'"
      @click="isOpen = false"
      class="fixed z-20 inset-0 bg-black opacity-50 transition-opacity lg:hidden"
    ></div>
    <!-- End Backdrop -->

    <div
      :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
      class="fixed z-30 inset-y-0 left-0 w-64 transition duration-300 transform bg-gray-900 overflow-y-auto lg:translate-x-0 lg:static lg:inset-0"
    >
      <div class="flex items-center justify-center mt-8">
        <div class="flex items-center">
          <Logo />

          <span class="text-white text-2xl mx-2 font-semibold">ClackChat</span>
        </div>
      </div>

      <nav class="mt-10">
        <button
          class="flex items-center mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Dashboard' ? activeClass : inactiveClass]"
          @click.prevent="showNewChatModal"
        >
          <i class="fa fa-plus h-5 w-5"></i>

          <span class="mx-4 text-lg"> New Chat</span>
        </button>
        <button
          class="flex items-center mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Dashboard' ? activeClass : inactiveClass]"
          @click.prevent=""
        >
          <i class="fas fa-comments h-5 w-5"></i>

          <span class="mx-4 text-lg "> My Threads</span>
        </button>
        <div class="overflow-y-auto h-132 bg-gray-800 rounded mx-4">
          <div v-for="rev in revList" :key="rev">
            <button
              class="flex w-full items-center mt-4 mb-4"
              :class="[$route.name === 'Blank' ? activeClass : inactiveClass]"
              @click.prevent="updateThread(rev)"
            >
              <span class="mx-5 px-5">{{ rev.substring(0, 8) }}</span>
            </button>
          </div>
        </div>
        <div v-if="loading">
          <i class="fas fa-spinner animate-spin"></i>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import { inject, ref } from "vue";
import { useSidebar } from "./../../hooks/useSidebar";
import * as PIConstants from "./../../constants/ProvideInjectConstants.js";
import Logo from "./../Logo";

export default {
  async setup() {
    const revList = inject(PIConstants.REV_LIST);
    const updateLoading = inject(PIConstants.UPDATE_LOADING_FUNCTION);
    const selectedThread = inject(PIConstants.SELECTED_THREAD_ID_KEY);
    const showNewChatModal = inject(PIConstants.SHOW_NEW_CHAT_MODAL_FUNCTION);
    const loading = inject("loading");
    const updateSelectedThread = inject(
      PIConstants.UPDATE_SELECTED_REV_FUNCTION
    );
    console.log("Selected Thread at Sidebar setup():", selectedThread.value);
    const { isOpen } = useSidebar();
    const activeClass = ref(
      "bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100"
    );
    const inactiveClass = ref(
      "border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100"
    );
    return {
      isOpen,
      activeClass,
      inactiveClass,
      selectedThread,
      updateSelectedThread,
      updateLoading,
      loading,
      revList,
      showNewChatModal
    };
  },
  components: {
    Logo
  },
  methods: {
    async updateThread(rev) {
      this.updateLoading(true);
      this.updateSelectedThread(rev);
      console.log("Update From Sidebard Clicked:", rev);
    }
  }
};
</script>
