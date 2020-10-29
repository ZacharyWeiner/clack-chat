<template>
  <div class="">
    <div v-if="searching">
      Searching ...
    </div>
    <div v-if="profiles.length === 0">
      You Have No Profiles Yet. Please Create One. <br /><br />
      <button
        @click.prevent="toggleShowSelect"
        class="bg-teal-700 hover:bg-teal-900 text-white font-bold py-2 px-4 rounded-full"
      >
        <i class="fas fa-arrow-left"></i> Back
      </button>
    </div>
    <div
      class="overflow-y-auto"
      style="max-height: 700px; overflow: -moz-scrollbars-vertical;"
    >
      <button  v-if="profiles.length > 0"
        @click.prevent="toggleShowSelect"
        class="bg-teal-700 hover:bg-teal-900 text-white font-bold py-2 px-4 rounded-full"
      >
        <i class="fas fa-arrow-left"></i> Back
      </button>
      <div v-for="profile in profiles" :key="profile._rev">
        <div class=" rounded bg-white overflow-hidden shadow-lg mt-6">
          <img
            class="h-56 w-full object-cover"
            :src="profile.image"
            alt="Profle Image"
          />
          <div class="px-6 py-4">
            <div class="text-gray-900 font-bold text-xl mb-2">
              {{ profile.displayName }}
            </div>
            <p class="text-gray-700 text-base">
              <vue3-markdown-it :source="profile.bio" />
            </p>
          </div>
          <div class="px-6 pt-4 pb-2">
            <span
              class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >#photography</span
            >
            <span
              class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >#travel</span
            >
            <span
              class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >#winter</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { inject, ref } from "vue";
import Computer from "bitcoin-computer";
import * as LSConstants from "@/constants/LocalStorageConstants";
import * as PIConstants from "@/constants/ProvideInjectConstants";
export default {
  setup() {
    const profiles = ref([]);
    const searching = ref(false);
    const toggleShowSelect = inject(PIConstants.PROFILE_SHOW_SELECT_FUNCTION);
    const computer = new Computer({
      seed: window.localStorage.getItem(LSConstants.SEED),
      chain: window.localStorage.getItem(LSConstants.CHAIN),
      network: window.localStorage.getItem(LSConstants.NETWORK)
    });
    return { computer, profiles, searching, toggleShowSelect };
  },
  data: function() {
    return {
      fetchProfiles: null
    };
  },
  async mounted() {
    this.fetchProfiles = async computer => {
      this.searching = true;
      let result = await computer.getRevs(this.publicKey);
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
      this.profiles = pros;
      this.searching = false;
    };
    if (this.computer) {
      this.fetchProfiles(this.computer);
    }
  }
};
</script>
<style scoped></style>
