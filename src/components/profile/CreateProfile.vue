<template>
  <Suspense>
    <template #default>
      <div>
        <div v-if="searching">
          Searching ...
        </div>
        <div class="mt-4">
          <div class="p-6 bg-white rounded-md shadow-md ">
            <div
              class="rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"
              :style="getImageUrlStyle"
            ></div>
            <div class="mx-auto w-full">
              <h2
                class="text-2xl text-gray-700 font-semibold capitalize text-center"
              >
                {{ displayName ? displayName : "Save a display name" }}
              </h2>
            </div>
            <div style="w-3/4 text-xs">
              <p class="break-all">
                {{ publicKey }}
              </p>
            </div>
            <form @submit.prevent="createProfile">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <div>
                  <label class="text-gray-700" for="username"
                    >Display Name</label
                  >
                  <input
                    class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                    type="text"
                    v-model="displayName"
                  />
                </div>

                <div>
                  <label class="text-gray-700" for="emailAddress">
                    Website
                  </label>
                  <input
                    class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                    type="website"
                    v-model="website"
                  />
                </div>

                <div>
                  <label class="text-gray-700">
                    Profile Image Link
                  </label>
                  <input
                    class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                    type="text"
                    v-model="imageUrl"
                  />
                </div>
                <div>
                  <label class="text-gray-700" for="passwordConfirmation">
                    Company
                  </label>
                  <input
                    class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                    type="text"
                    v-model="company"
                  />
                </div>
                <div>
                  <label class="text-gray-700" for="passwordConfirmation">
                    Position
                  </label>
                  <input
                    class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                    type="text"
                    v-model="jobTitle"
                  />
                </div>
                <div>
                  <label class="text-gray-700" for="passwordConfirmation">
                    Company Link
                  </label>
                  <input
                    class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                    type="text"
                    v-model="companyUrl"
                  />
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-1 gap-6 mt-4">
                <div>
                  <label class="text-gray-700" for="passwordConfirmation">
                    Bio (can be markdown)
                  </label>
                  <textarea
                    class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                    v-model="bio"
                  />
                </div>
              </div>
              <div class="flex justify-end mt-4">
                <button class="px-4 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700">
                  Save
                </button>
              </div>
            </form>
            <button
              @click.prevent="toggleShowEdit"
              class="px-4 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700">
              <i class="fas fa-arrow-left"></i>Back
            </button>
          </div>
        </div>
      </div>
    </template>
    <template #loading>
      Loading....
    </template>
  </Suspense>
</template>
<script>
import { inject, ref } from "vue";
import * as PIConstants from "@/constants/ProvideInjectConstants.js";
import * as LSConstants from "@/constants/LocalStorageConstants.js";
import Computer from "bitcoin-computer";
import FileUtils from "./../../utilities/FileUtils.js";
export default {
  setup() {
    const searching = ref("");
    const displayName = ref("");
    const website = ref("");
    const imageUrl = ref("");
    const company = ref("");
    const jobTitle = ref("");
    const companyUrl = ref("");
    const bio = ref("");
    const profile = ref("");
    const revs = ref([]);
    const _publicKey = inject(PIConstants.PUBLIC_KEY);
    const toggleShowEdit = inject(PIConstants.PROFILE_SHOW_EDIT_FUNCTION);
    console.log("Testing Key:", _publicKey.value);
    const publicKey = _publicKey;
    const computer = new Computer({
      seed: window.localStorage.getItem(LSConstants.SEED),
      chain: window.localStorage.getItem(LSConstants.CHAIN),
      network: window.localStorage.getItem(LSConstants.NETWORK)
    });
    console.log(window.localStorage.getItem(LSConstants.SEED));
    console.log(computer.db.wallet.getAddress());
    console.log(publicKey);
    return {
      publicKey,
      displayName,
      website,
      imageUrl,
      company,
      companyUrl,
      jobTitle,
      bio,
      profile,
      computer,
      revs,
      searching,
      toggleShowEdit
    };
  },
  data: function() {
    return {
      fetchProfile: null
    };
  },
  async mounted() {
    this.fetchProfile = async () => {
      this.searching = true;
      let result = await this.computer.getRevs(this.publicKey);
      console.log(result);
      this.revs = result;
      let pros = [];
      if (result && result.length > 0) {
        await Promise.all(
          result.map(async r => {
            let synced = await this.computer.sync(r);
            if (synced.contractTypeName === "UserProfile") {
              console.log("Found A Profile");
              this.profile = synced;
              pros.push(synced);
              this.displayName = synced.displayName;
              this.website = synced.website;
              this.imageUrl = synced.image;
              this.company = synced.company;
              this.jobTitle = synced.jobTitle;
              this.companyUrl = synced.companyUrl;
              this.bio = synced.bio;
            }
          })
        );
      }
      console.log(pros);
      this.searching = false;
    };
    this.fetchProfile();
  },
  computed: {
    getImageUrlStyle() {
      if (
        this.imageUrl === null ||
        this.imageUrl === "" ||
        !this.imageUrl.includes("http")
      ) {
        return "background-image: url('https://source.unsplash.com/MP0IUfwrn0A')";
      }
      return `background-image: url('${this.imageUrl}')`;
    }
  },
  methods: {
    async createProfile() {
      console.log(
        this.publicKey.toString(),
        this.displayName,
        this.website,
        this.imageUrl,
        this.company,
        this.jobTitle,
        this.companyUrl,
        this.bio
      );
      console.log(window.localStorage.getItem(LSConstants.SEED));
      let _computer = new Computer({
        seed: window.localStorage.getItem(LSConstants.SEED),
        chain: window.localStorage.getItem(LSConstants.CHAIN),
        network: window.localStorage.getItem(LSConstants.NETWORK)
      });
      let _contract = await FileUtils.importFromPublic("user-profile.js");
      let pkString = this.publicKey.toString();
      let profileTxID = await _computer.new(_contract, [
        pkString,
        "clack.chat",
        this.displayName,
        this.website,
        this.bio,
        this.imageUrl,
        this.jobTitle,
        this.company,
        this.companyUrl
      ]);
      console.log(profileTxID);
    }
  }
};
</script>
<style scoped></style>
