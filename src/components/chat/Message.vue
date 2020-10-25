<template>
  <div class="flex items-start pb-4 bg-gray-100 rounded">
    <img
      src="https://twitter.com/davidhemphill/profile_image"
      class="w-10 h-10 rounded mr-3"
    />
    <div class="flex-1 overflow-hidden">
      <div class=''>
        <span class="font-bold text-xs underline">{{ m.split(":")[1] }}</span>
        <span class="pl-3"></span>
        <span class="text-grey text-xs"
          >{{ m.split(":")[3] }}:{{ m.split(":")[4] }} </span
        >
      </div>
      <p class="text-black leading-normal">
        {{ m.split(":")[2] }}
      </p>
    </div>
  </div>
</template>
<script>
export default {
  setup(props) {
    const m = new String(props.message);
    return { m };
  },
  props: ["message"]
};
</script>
