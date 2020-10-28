<template>
  <Suspense>
    <template #default>
      <div
        class="font-sans antialiased text-gray-900 leading-normal tracking-wider bg-cover h-full"
        style="background-image:url('https://source.unsplash.com/1L71sPT5XKc');"
      >
        <div v-if="showEdit" :class="getClasses('profileWrapper')">
          <div id="profile" :class="getClasses('profile')">
            <CreateProfile />
          </div>
        </div>
        <div v-else-if="showSelect" :class="getClasses('profileWrapper')">
          <div id="profile" :class="getClasses('profile')">
            <List />
          </div>
        </div>

        <div v-else :class="getClasses('profileWrapper')">
          <!--Main Col-->
          <div id="profile" :class="getClasses('profile')">
            <div :class="getClasses('profileInner')">
              <!-- Image for mobile view-->
              <div
                :class="getClasses('mobileImage')"
                style="background-image: url('https://source.unsplash.com/MP0IUfwrn0A')"
              ></div>

              <h1 :class="getClasses('displayName')">{{ displayName }}</h1>
              <i class="fab fa-bitcoin fa-2x" :class="getCoinClass()"
                >: <span class="align-middle"> {{ balance }}</span></i
              >
              <span class="text-xl pl-2">satoshis</span>

              <div :class="getClasses('nameUndeline')"></div>
              <p :class="getClasses('detailsContainer')">
                <i class="fas fa-map-pin p-2"></i>
                <span class="font-bold"> Address:</span>
              </p>
              {{ address }}
              <br />
              <p
                class="pt-4 text-base f flex items-center justify-center lg:justify-start "
              >
                <i class="fas fa-key p-2"></i>
                <span class="font-bold">Public Key: </span><br />
              </p>
              <p class="break-all">
                {{ publicKey }}
              </p>
              <p class="pt-8 text-sm">
                Totally optional short description about yourself, what you do
                and so on.
              </p>

              <div class="pt-12 pb-8">
                <a
                  href="/chat"
                  class="bg-teal-700 hover:bg-teal-900 text-white font-bold py-2 px-4 rounded-full"
                >
                  Back To Chat
                </a>
              </div>
              <div class="pt-12 pb-8">
                <button
                  @click.prevent="showForm"
                  class="bg-teal-700 hover:bg-teal-900 text-white font-bold py-2 px-4 rounded-full"
                >
                  Create Profile
                </button>
                <button
                  @click.prevent="showList"
                  class="bg-teal-700 hover:bg-teal-900 text-white font-bold py-2 px-4 rounded-full"
                >
                  Select Profile
                </button>
              </div>

              <Links />

              <!-- Use https://simpleicons.org/ to find the svg for your preferred product -->
            </div>
          </div>

          <!--Img Col-->
          <div class="w-full lg:w-2/5">
            <!-- Big profile image for side bar (desktop) -->
            <img
              src="https://source.unsplash.com/MP0IUfwrn0A"
              class="rounded-none lg:rounded-lg shadow-2xl hidden lg:block"
            />
          </div>

          <!-- Pin to top right corner -->
          <!-- <div class="absolute top-0 right-0 h-12 w-18 p-4">
          <button class="js-change-theme focus:outline-none">🌙</button>
        </div> -->
        </div>
      </div>
    </template>
    <template #loading>
      Loading ...
    </template>
  </Suspense>
</template>
<script>
import { provide, ref } from "vue";
import Computer from "bitcoin-computer";
import * as LSConstants from "./../constants/LocalStorageConstants.js";
import * as PIConstants from "./../constants/ProvideInjectConstants.js";
import CreateProfile from "@/components/profile/CreateProfile";
import Links from "@/components/profile/Links";
import List from "@/components/profile/List";
export default {
  async setup() {
    const showEdit = ref(false);
    const showSelect = ref(false);
    const publicKey = ref("");
    provide(PIConstants.PUBLIC_KEY, publicKey);
    let seed = window.localStorage.getItem(LSConstants.SEED);
    let network = window.localStorage.getItem(LSConstants.NETWORK);
    let chain = window.localStorage.getItem(LSConstants.CHAIN);
    let computer = new Computer({
      chain: chain,
      network: network,
      seed: seed
    });
    provide(PIConstants.COMPUTER, computer);
    publicKey.value = (await computer.db.wallet.getPublicKey()).toString();
    let address = (await computer.db.wallet.getAddress()).toString();
    let balance = (await computer.db.wallet.getBalance()).toString();
    let displayName = window.localStorage.getItem(LSConstants.DISPLAYNAME);
    console.log(publicKey.value);
    return {
      computer,
      publicKey,
      address,
      displayName,
      showEdit,
      showSelect,
      balance
    };
  },
  components: {
    CreateProfile,
    List,
    Links
  },
  methods: {
    showForm() {
      if (this.showEdit) this.showEdit = false;
      else this.showEdit = true;
    },
    showList() {
      if (this.showSelect) this.showSelect = false;
      else this.showSelect = true;
    },
    getCoinClass() {
      if (window.localStorage.getItem(LSConstants.CHAIN) === LSConstants.BCH)
        return "text-green-500";
      return "text-orange-500";
    },
    getClasses(placement) {
      let classes = "";
      switch (placement) {
        case "profileWrapper":
          classes =
            "max-w-4xl flex items-center h-auto lg:h-screen flex-wrap mx-auto py-8 lg:my-0";
          break;
        case "profile":
          classes =
            "w-full lg:w-3/5 rounded-lg lg:rounded shadow-2xl bg-white opacity-40 mx-6 lg:mx-0";
          break;
        case "profileInner":
          classes = "p-4 md:p-12 text-center lg:text-left";
          break;
        case "mobileImage":
          classes =
            "block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center";
          break;
        case "displayName":
          classes = "text-3xl font-bold pt-8 lg:pt-0";
          break;
        case "nameUndeline":
          classes =
            "mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-teal-500 opacity-25";
          break;
        case "detailsContainer":
          classes =
            "pt-4 text-base f flex items-center justify-center lg:justify-start";
          break;
        default:
          break;
      }
      return classes;
    }
  }
};
</script>
<style></style>
