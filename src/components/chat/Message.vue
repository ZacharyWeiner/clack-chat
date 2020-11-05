<template>
  <div class="items-start pb-4 bg-gray-100 rounded">
    <img :src="messageAsJson.image" class="w-10 h-10 rounded mr-3" />
    <div class="flex-1 overflow-hidden">
      <div class="">
        <span class="font-bold text-xs underline">{{
          messageAsJson.displayName
        }}</span>
        <span class="pl-3"></span>
        <span class="text-grey text-xs"> </span>
      </div>
      <br />
      <div class="message">
        <vue3-markdown-it :source="messageAsJson.message" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  setup(props) {
    const messageAsJson = JSON.parse(props.message);
    return { messageAsJson };
  },
  props: ["message"]
};
</script>
