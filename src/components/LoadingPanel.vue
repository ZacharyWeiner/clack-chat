<template>
  <div
    :class="
      `modal z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`
    "
  >
    <div class="modal-overlay absolute w-full h-full "></div>

    <div
      class="modal-container w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto"
    >
      <!-- Add margin if you want to see some of the overlay behind the modal-->
      <div class="modal-content text-left pt-5 m-6">
        <!--Body-->
        <div
          class="max-w-sm p-5 w-full bg-white shadow-md rounded-md overflow-hidden border z-51"
        >
          <i class="animate-spin fas fa-spinner text-4xl"></i>
          <span class="text-xl  pl-10"> Loading Messages</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
