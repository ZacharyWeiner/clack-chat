<template>
  <div class="py-12 bg-white">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <p
          class="text-base leading-6 text-indigo-600 font-semibold tracking-wide uppercase"
        >
          A Simple Chat Application Built On The Blockchain
        </p>
        <h3
          class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10"
        >
          Your Data Is Your Property
        </h3>
        <p class="mt-4 max-w-2xl text-xl leading-7 text-gray-500 lg:mx-auto">
          Clack.chat is a client side web application that runs in your browser.
          We never send your data to "our" servers. All messages are saved on
          Bitcoin directly from your browser.
        </p>
      </div>

      <div class="mt-10">
        <ul class="md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
          <li>
            <div class="flex">
              <div class="flex-shrink-0">
                <div
                  class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white"
                >
                  <!-- Heroicon name: globe-alt -->
                  <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-lg leading-6 font-medium text-gray-900">
                  Clack.chat is Open Source
                </h4>
                <p class="mt-2 text-base leading-6 text-gray-500">
                  Clack.chat is an open-source project, and built using
                  BitcoinComputer.
                  <br />
                  <a
                    class="text-indigo-600"
                    href="https://github.com/ZacharyWeiner/clack-chat"
                    target="_blank"
                  >
                    <i class="fab fa-github-alt text-md"> Clack on GitHub.</i>
                  </a>
                  <br />
                  <a
                    class="text-indigo-600"
                    href="https://github.com/bitcoin-computer"
                    target="_blank"
                    ><i class="fab fa-github-alt text-md">
                      Bitcoin-Computer on GitHub.</i
                    >
                  </a>
                </p>
              </div>
            </div>
          </li>
          <li class="mt-10 md:mt-0">
            <div class="flex">
              <div class="flex-shrink-0">
                <div
                  class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white"
                >
                  <!-- Heroicon name: scale -->
                  <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-lg leading-6 font-medium text-gray-900">
                  You Own Your Data
                </h4>
                <p class="mt-2 text-base leading-6 text-gray-500">
                  There are no accounts or emails to login with and you do not
                  need to 'register' with Clack.chat. Your seed is yours. We
                  don't assign it to you or manage it. Every Chat or message you
                  creat with your seed (a.k.a. passphrase) is yours... not ours.
                </p>
              </div>
            </div>
          </li>
          <li class="mt-10 md:mt-0">
            <div class="flex">
              <div class="flex-shrink-0">
                <div
                  class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white"
                >
                  <!-- Heroicon name: annotation -->
                  <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-lg leading-6 font-medium text-gray-900">
                  Invite-Only Permission
                </h4>
                <p class="mt-2 text-base leading-6 text-gray-500">
                  Clack.chat uses smart objects build using Bitcoin-Computer to create chat threads which can only be acccessed/updated by accounts with permission from the chat creator. The thread is not stored in any single place on the blockchain. Because every message is a unique transaction, your data is more secure than in other 'on-chain' solutions.
                </p>
              </div>
            </div>
          </li>
          <li class="mt-10 md:mt-0">
            <div class="flex">
              <div class="flex-shrink-0">
                <div
                  class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white"
                >
                  <!-- Heroicon name: lightning-bolt -->
                  <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-lg leading-6 font-medium text-gray-900">
                  Chat In Real Time
                </h4>
                <p class="mt-2 text-base leading-6 text-gray-500">
                  Bitcoin is the fastest and easiest way to store and share data without a database or a server. Using secure 0xConf transactions, messages are recieved by your chat group in &lt; 3 seconds. No server, no wss, no sockets, no problem.
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped></style>
