<template>
  <div class="flex items-start mb-4 text-sm">
    <img
      src="https://twitter.com/davidhemphill/profile_image"
      class="w-10 h-10 rounded mr-3"
    />
    <div class="flex-1 overflow-hidden">
      <div>
        <span class="font-bold">{{ m.split(":")[1] }}</span>
        <span class="text-grey text-xs"
          >{{ m.split(":")[3] }}:{{ m.split(":")[4] }} :
          {{ m.split(":")[5] }}</span
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
