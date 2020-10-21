<template>
  <div id="app">
    <HelloWorld msg="Welcome to MFC" />
  </div>
</template>
<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
export default {
  name: "Home",
  components: {
    HelloWorld
  }
};
</script>
