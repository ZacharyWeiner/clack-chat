<template>
  <Suspense>
    <template #default>
      <div class="flex flex-col h-full">
        <slot />
         <footer class="bottom-0 text-center">
          <div class="w-full  p-4">
            <h1 class="font-bold text-xs text-primary-600">
              Open Source Code On
              <a
                href="https://github.com/ZacharyWeiner/clack-chat"
                target="_blank"
                ><i class="fab fa-github-alt text-md"></i
              ></a>
            </h1>
            <span class="text-xs text-primary-600 text-center">
              Made with ❤️ by
              <a class="underline" href="https://twitter.com/u/developingzack">
                @DevelopingZack
              </a>
              <br />
              Co-Founder &amp; CTO:
              <a class="underline" href="http://www.artisint.com">
                Artis International
              </a>
            </span>
          </div>
        </footer>
      </div>
    </template>
    <template #loading>
      Loading...
    </template>
  </Suspense>
</template>
