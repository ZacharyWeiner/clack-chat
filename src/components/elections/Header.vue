<template>
  <header
    class="flex justify-between items-center py-4 px-6 bg-white border-b-4 border-indigo-600"
  >
    <div class="flex items-center">
      <button
        @click="isOpen = true"
        class="text-gray-500 focus:outline-none lg:hidden"
      >
        <svg
          class="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6H20M4 12H20M4 18H11"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <div class="relative mx-4 lg:mx-0">
        <div class="text-3xl">{{ props.title }}</div>
        <!-- <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
          <svg class="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span> -->

        <!-- <input
          class="form-input w-32 sm:w-64 rounded-md pl-10 pr-4 focus:border-indigo-600"
          type="text"
          placeholder="Search"
        /> -->
      </div>
    </div>

    <div class="flex items-center">
      <div>
        <span class="rounded px-1 py-1" :class="network"> {{ network }} </span>
      </div>
      <div>
        <span class="rounded px-1 py-1 ml-1" :class="chain"> {{ chain }} </span>
      </div>
      <button class="flex mx-4 text-gray-600 focus:outline-none">
        <svg
          class="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <div @click="dropdownOpen = !dropdownOpen">{{ displayName }}</div>
      <div class="relative">
        <!-- <button
          @click="dropdownOpen = !dropdownOpen"
          class="relative z-10 block h-8 w-8 rounded-full overflow-hidden shadow focus:outline-none"
        >
          <img
            class="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=296&q=80"
            alt="Your avatar"
          />
        </button> -->
        <div
          v-show="dropdownOpen"
          @click="dropdownOpen = false"
          class="fixed inset-0 h-full w-full z-10"
        ></div>

        <div
          v-show="dropdownOpen"
          class="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20"
        >
          <a
            href="/profile"
            class="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
          >
            Profile
          </a>
          <button
            @click="logout"
            class="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref } from "vue";
import * as Constants from "@/constants/LocalStorageConstants";

export default {
  setup(props) {
    const dropdownOpen = ref(false);
    //const { isOpen } = useSidebar();
    let _dn = window.localStorage.getItem(Constants.DISPLAYNAME);
    const displayName = ref(_dn);
    console.log("Display Name:", _dn);
    const chain = ref(window.localStorage.getItem(Constants.CHAIN));
    const network = ref(window.localStorage.getItem(Constants.NETWORK));
    return {
      //isOpen,
      dropdownOpen,
      displayName,
      props,
      chain,
      network
    };
  },
  methods: {
    logout() {
      console.log("clearing local storage");
      window.localStorage.clear();
      console.log(
        "Display name should be null and is :",
        window.localStorage.getItem(Constants.DISPLAYNAME)
      );
      this.$router.push("/");
    }
  },
  props: ["title"]
};
</script>
