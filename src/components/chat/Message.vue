<template>
  <div class="flex items-start pb-4 bg-gray-100 rounded">
    <img :src="image" class="w-10 h-10 rounded mr-3" />
    <div class="flex-1 overflow-hidden">
      <div class="">
        <span class="font-bold text-xs underline">{{ displayName }}</span>
        <span class="pl-3"></span>
        <span class="text-grey text-xs"> </span>
      </div>
      <br />
      <div class="message">
        <vue3-markdown-it :source="body" />
      </div>
    </div>
  </div>
</template>
<script>
import { inject, ref } from "vue";
import * as PIConstants from "./../../constants/ProvideInjectConstants.js";
export default {
  setup(props) {
    const m = new String(props.message);
    const profiles = inject(PIConstants.PROFILE_LIST_KEY);
    const image = ref("");
    console.log("Profiles @ Message", profiles);

    let json = {};
    try {
      json = JSON.parse(m);
      console.log("Message Parsing to JSON:", json);
    } catch (err) {
      console.log(err);
    }
    const displayName = ref(json.displayName);
    const body = ref(json.message);
    const date = ref(json.date);
    if (profiles[0]) {
      console.log("Profile Value @ Messages", profiles[0].displayName);
      displayName.value = profiles[0].displayName;
      image.value = profiles[0].image;
    }
    return { displayName, body, date, image };
  },
  props: ["message"]
};
</script>
<style scoped>
.message > div > h2 > a {
  color: blueviolet;
}
</style>
