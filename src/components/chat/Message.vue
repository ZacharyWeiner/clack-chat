<template>
  <div class="rounded  overflow-hidden shadow-lg mt-6">
    <div class="px-6 py-4">
      <div class="text-gray-900 font-bold text-xl mb-2">
        {{ m.split(":")[1] }} - <small>{{ m.split(":")[3] }}</small>
      </div>
      <p class="text-gray-700 text-lg text-base">
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
