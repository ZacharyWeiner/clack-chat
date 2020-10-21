<template>
  <div class="hello">
    <div class="bg-gray-50">
      <div class="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 class="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
          <span class="text-indigo-600">{{ msg }}</span>
        </h2>
        <div class="mt-8 flex lg:flex-shrink-0 lg:mt-0">
          <div class="inline-flex rounded-md shadow">
            <a href="https://medium.com/@horaceh/how-to-setup-a-tailwind-css-tailwind-ui-project-with-vue-cli-fdc671d69e48" class="btn btn-primary">
              How to
            </a>
          </div>
          <div class="ml-3 inline-flex rounded-md shadow">
            <a href="https://github.com/horaceho/vue-tailwind-skeleton" class="btn">
              Github
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HelloWorld',
  props: {
   msg: String
  }
}
</script>