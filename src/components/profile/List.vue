<template>
  <div>
    <div v-if="searching">
      Searching ...
    </div>
    <div
      class="overflow-y-auto"
      style="max-height: 800px; overflow: -moz-scrollbars-vertical;"
    >
      <div v-for="profile in profiles" :key="profile._rev">
        <div class=" rounded bg-white overflow-hidden shadow-lg mt-6">
          <img class="w-full" :src="profile.image" alt="Profle Image" />
          <div class="px-6 py-4">
            <div class="text-gray-900 font-bold text-xl mb-2">
              {{ profile.displayName }}
            </div>
            <p class="text-gray-700 text-base">
              {{ profile.bio }}
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
import { ref } from "vue";
import Computer from "bitcoin-computer";
import * as LSConstants from "@/constants/LocalStorageConstants";
export default {
  setup() {
    const profiles = ref([]);
    const searching = ref(false);
    const computer = new Computer({
      seed: window.localStorage.getItem(LSConstants.SEED),
      chain: window.localStorage.getItem(LSConstants.CHAIN),
      network: window.localStorage.getItem(LSConstants.NETWORK)
    });
    return { computer, profiles, searching };
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
