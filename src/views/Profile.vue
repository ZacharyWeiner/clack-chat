<template>
  <Suspense>
    <template #default>
      <div
        class="font-sans antialiased text-gray-900 bg-gray-300 leading-normal tracking-wider bg-cover h-full"
      >
        <div v-if="showEdit" :class="getClasses('profileWrapper')">
          <div id="profile" :class="getClasses('profile')">
            <div :class="getClasses('profileInner')">
              <CreateProfile />
            </div>
          </div>
        </div>
        <div v-else-if="showSelect" :class="getClasses('profileWrapper')">
          <div id="profile" :class="getClasses('profile')">
            <div :class="getClasses('profileInner')">
              <List />
            </div>
          </div>
        </div>
        <div
          v-else
          :class="getClasses('profileWrapper')"
          class="overflow-y-auto"
        >
          <!--Main Col-->
          <div id="profile" :class="getClasses('profile')">
            <div :class="getClasses('profileInner')">
              <!-- Image for mobile view-->
              <div v-if="profile">
                <div
                  :class="getClasses('mobileImage')"
                  :style="{ backgroundImage: `url('${profile.image}')` }"
                ></div>
              </div>
              <div v-else>
                <div :class="getClasses('mobileImage')"></div>
              </div>
              <div class="w-full">
                <h1 :class="getClasses('displayName')">{{ displayName }}</h1>
                <div class="flex w-full ">
                  <div class="w-4/5">
                    <i class="fab fa-bitcoin fa-1x" :class="getCoinClass()"
                      >: <span class="align-middle"> {{ balance }}</span
                      ><span class="text-lg pl-2 mt-2 text-gray-700"
                        >satoshis</span
                      ></i
                    >
                  </div>
                  <div class="">
                    <span>
                      <button
                        class="px-1 py-0 text-sm ml-2 underline justify-end no-break"
                        @click.prevent="showSend = !showSend"
                      >
                        {{ sendButtonText }} <i :class="sendButtonClass"></i>
                      </button>
                    </span>
                  </div>
                </div>
                <div v-if="showSend" class="w-full">
                  <div>
                    <label class="text-gray-700" for="passwordConfirmation">
                      Amount (in satoshis)
                    </label>
                    <input
                      class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                      type="text"
                      v-model="amount"
                    />
                  </div>
                  <div>
                    <label class="text-gray-700" for="passwordConfirmation">
                      Recipient Address:
                    </label>
                    <input
                      class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                      type="text"
                      v-model="recipientAddress"
                    />
                  </div>
                  <div class="flex w-full justify-end">
                    <div>
                      <button @click="sendTo" class="btn btn-secondary">
                        Send &nbsp; <i class="fas fa-arrow-circle-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div :class="getClasses('nameUnderline')"></div>
              <p :class="getClasses('detailsContainer')">
                <i class="fas fa-map-pin p-2"></i>
                <span class="font-bold"> Address:</span>{{ address }}
              </p>
              <p
                class="pt-1 text-base f flex items-center justify-center lg:justify-start "
              >
                <i class="fas fa-key p-2"></i>
                <span class="font-bold">Public Key: </span><br />
              </p>
              <p class="break-all">
                {{ publicKey }}
              </p>
              <div>
                <p
                  class="pt-2 pl-2 text-sm overflow-y-auto bg-gray-200 rounded shadow-xl mt-2"
                  style="min-height:300px; max-height:300px;"
                >
                  <vue3-markdown-it :source="bioOrEmpty" />
                </p>
              </div>
              <br />
              <!-- Begin Tags List -->
              <div
                class="inline-flex max-w-md w-full bg-white shadow-md rounded-lg overflow-hidden ml-3"
              >
                <div class="flex justify-center items-center w-12 bg-green-500">
                  <svg
                    class="h-6 w-6 fill-current text-white"
                    viewBox="0 0 40 40"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z"
                    />
                  </svg>
                </div>

                <div class="-mx-31 py-2 px-1">
                  <div class="mx-3">
                    <span class="text-green-500 font-semibold"
                      ><i class="fas fa-address-card pr-2"></i>
                      {{
                        profile && profile.jobTitle
                          ? profile.jobTitle
                          : "Wizard of Wonderful"
                      }}
                    </span>
                    <p class="text-gray-600 text-sm">
                      <i class="fas fa-building pr-2"></i
                      >{{
                        profile && profile.company
                          ? profile.company
                          : "Super Awesome co."
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <!-- End Tags List -->
              <Links />
              <div class="pt-12">
                <div>
                  <button
                    @click.prevent="showForm"
                    class="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  >
                    <i class="fas fa-user-plus"></i> Create Profile
                  </button>
                  <button
                    @click.prevent="showList"
                    class=" w-1/2 bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-full"
                  >
                    <i class="far fa-check-circle"></i> Select Profile
                  </button>
                </div>
                <div></div>
              </div>
              <div class="pt-12 pb-2">
                <a
                  href="/chat"
                  class="bg-gray-700 hover:bg-gray-900 text-white font-bold py-4 no-underline px-4 rounded-full"
                >
                  <i class="fas fa-arrow-left"></i> Back To Chat
                </a>
              </div>
            </div>
          </div>
          <!--Img Col-->
          <div class="w-full lg:w-2/5">
            <!-- Big profile image for side bar (desktop) -->
            <img
              :src="imageOrEmpty"
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
    const showSend = ref(false);
    const recipientAddress = ref("");
    const amount = ref(0);
    const showEdit = ref(false);
    const showSelect = ref(false);
    const publicKey = ref("");
    const profile = ref({
      bio: "empty",
      image:
        "https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png"
    });

    let computer = new Computer({
      chain: window.localStorage.getItem(LSConstants.CHAIN),
      network: window.localStorage.getItem(LSConstants.NETWORK),
      seed: window.localStorage.getItem(LSConstants.SEED)
    });

    const toggleShowEdit = () => {
      showEdit.value = !showEdit.value;
    };

    const toggleShowSelect = () => {
      showSelect.value = !showSelect.value;
    };
    provide(PIConstants.PUBLIC_KEY, publicKey);
    provide(PIConstants.COMPUTER, computer);
    provide(PIConstants.PROFILE_SHOW_EDIT_FUNCTION, toggleShowEdit);
    provide(PIConstants.PROFILE_SHOW_SELECT_FUNCTION, toggleShowSelect);
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
      balance,
      toggleShowEdit,
      toggleShowSelect,
      profile,
      showSend,
      recipientAddress,
      amount
    };
  },
  components: {
    CreateProfile,
    List,
    Links
  },
  async mounted() {
    this.fetchProfile();
  },
  computed: {
    bioOrEmpty() {
      if (!this.profile || this.profile.bio === null)
        return "### We Couldnt Find Your Profile \n --- \n **Click The 'Create Profile' button below to create one \n\n :sparkles: the cool part is you can use markdown in your profile to make it pop \n \n :astonished: :O :)";
      else return this.profile.bio;
    },
    imageOrEmpty() {
      if (!this.profile || this.profile.image === null)
        return "https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png";
      else return this.profile.image;
    },
    sendButtonText() {
      if (this.showSend) return "Close";
      else return "Send";
    },
    sendButtonClass() {
      if (this.showSend) return "";
      else return "fas fa-external-link-alt";
    }
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
    async fetchProfile() {
      let revs = await this.computer.getRevs(this.publicKey);
      let pros = [];
      await Promise.all(
        revs.map(async r => {
          console.log("Mapping: ", r);
          let lr = "";
          try {
            lr = await this.computer.getLatestRev(r);
          } catch (err) {
            console.log(err);
          }
          if (lr === "") {
            console.log("Latest Rev: ", lr);
            lr = r;
          }
          let obj = await this.computer.sync(lr);
          console.log("Obj: ", obj);
          if (obj.contractTypeName && obj.contractTypeName === "UserProfile") {
            pros.push(obj);
          }
        })
      );
      this.profile = pros[0];
    },
    async sendTo() {
      try {
        let txId = await this.computer.db.wallet.send(
          parseInt(this.amount, 10),
          this.recipientAddress
        );
        console.log(txId);
        alert(
          `Successfuly sent ${this.amount} satoshis to ${this.recipientAddress}`
        );
        this.recipientAddress = "";
        this.amount = 0;
      } catch (err) {
        console.log(err);
        alert(err);
      }
    },
    getClasses(placement) {
      let classes = "";
      switch (placement) {
        case "profileWrapper":
          classes =
            "max-w-4xl xs:mr-1 flex items-center h-auto lg:h-screen flex-wrap mx-auto py-8 lg:my-0";
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
          classes = "text-3xl w-full font-bold pt-8 lg:pt-0";
          break;
        case "nameUnderline":
          classes =
            "mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-blue-500 opacity-25";
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
