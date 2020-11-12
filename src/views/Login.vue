<template>
  <div class="flex justify-center items-center h-screen bg-gray-200 px-6">
    <div class="p-6 max-w-sm w-full bg-white shadow-md rounded-md">
      <div class="flex justify-center items-center">
        <svg
          class="h-10 w-10"
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"
            fill="#4C51BF"
            stroke="#4C51BF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z"
            fill="white"
          />
        </svg>
        <span class="text-gray-700 font-semibold text-2xl text-center"
          >{{titleText}}</span
        >
      </div>

      <form
        class="mt-4"
        @submit.prevent="login(displayName, password, chain, network)"
      >
        <label class="block">
          <span class="text-gray-700 text-sm">Display Name</span>
          <input
            type="text"
            class="form-input mt-1 block w-full rounded-md focus:border-indigo-600"
            v-model="displayName"
            placeholder="What Should We Call You?"
          />
        </label>

        <label class="block mt-3">
          <span class="text-gray-700 text-sm" style="text-transform: capitalize"
            >{{ chain }} {{ network }} Seed Phrase (BIP39)</span
          >
          <input
            type="text"
            class="form-input mt-1 block w-full rounded-md focus:border-indigo-600"
            v-model="password"
            placeholder="ill wall allow purpose ..."
          />
          <span class="text-gray-700 text-sm"
            >Your seed is <span class="underline">never</span> sent to any
            server</span
          >
          <a
            href="http://accounts.protoshi.com"
            class="btn w-full text-sm"
            target="_blank"
          >
            Get A Random Seed
          </a>
        </label>
        <div class="mt-6">
          <button
            class="py-2 px-4 text-center bg-indigo-600 rounded-md w-full text-white text-sm hover:bg-indigo-500"
          >
            Sign in
          </button>
        </div>
      </form>
      <div class="mt-6">
        <button
          @click.prevent="toggleNetwork"
          class="py-2 px-4 text-center rounded-md w-full text-white text-sm hover:bg-gray-500"
          :class="oppositeNetwork"
          style="text-transform: capitalize"
        >
          Switch To {{ oppositeNetwork }}
        </button>
      </div>
      <div class="mt-1">
        <button
          @click.prevent="toggleChain"
          class="py-2 px-4 text-center  rounded-md w-full text-white text-sm hover:bg-gray-500"
          :class="oppositeChain"
        >
          Switch To {{ oppositeChain }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import Computer from "bitcoin-computer";
import * as Constants from "./../constants/LocalStorageConstants";

export default defineComponent({
  setup() {
    const router = useRouter();
    const displayName = ref("");
    const password = ref("");
    const checked = ref("");
    let _chain = window.localStorage.getItem(Constants.CHAIN);
    let _net = window.localStorage.getItem(Constants.NETWORK);
    let site = window.localStorage.getItem(Constants.SITE);
    console.log("Site setting @ time of login:", site);
    if (!_chain || _chain === "") {
      _chain = Constants.BSV;
    }
    if (!_net || _net === "") {
      _net = Constants.TESTNET;
    }
    console.log(_chain, _net);
    const chain = ref(_chain);
    const network = ref(_net);

    const toggleChain = () => {
      if (!chain.value || chain.value === Constants.BCH) {
        window.localStorage.setItem(Constants.CHAIN, Constants.BSV);
        chain.value = Constants.BSV;
      } else {
        window.localStorage.setItem(Constants.CHAIN, Constants.BCH);
        chain.value = Constants.BCH;
      }
    };

    const toggleNetwork = () => {
      if (!network.value || network.value === Constants.MAINNET) {
        window.localStorage.setItem(Constants.NETWORK, Constants.TESTNET);
        network.value = Constants.TESTNET;
      } else {
        window.localStorage.setItem(Constants.NETWORK, Constants.MAINNET);
        network.value = Constants.MAINNET;
      }
    };

    const login = async (name, pass, chain, net) => {
      if (!pass) {
        alert("Seed is required");
        return;
      }
      try {
        const computer = new Computer({
          chain: chain,
          network: net,
          seed: pass
        });
        let address = await computer.db.wallet.getAddress();
        console.log("Successfully Logged In", address);
        window.localStorage.setItem(Constants.SEED, pass);
        window.localStorage.setItem(Constants.DISPLAYNAME, name);
        window.localStorage.setItem(Constants.CHAIN, chain);
        window.localStorage.setItem(Constants.NETWORK, net);
        let site = window.localStorage.getItem(Constants.SITE);
        console.log("Site setting @ time of login:", site);
        if (site && site === Constants.SITE_ELECTIONS) {
          router.push("/elections");
        } else {
          router.push("/chat");
        }
      } catch (err) {
        console.log(err);
        if (
          err.toString() ===
          "TypeError: errors.UnknownWordlist is not a constructor"
        ) {
          alert(
            "You must login with a BSV seed phrase. Use the link on the login page to generate a random one."
          );
        } else {
          alert(err);
        }
        router.push("/login");
      }
    };

    return {
      login,
      displayName,
      password,
      checked,
      chain,
      site,
      network,
      toggleChain,
      toggleNetwork
    };
  },
  computed: {
    oppositeChain() {
      if (this.chain === Constants.BSV) return Constants.BCH;
      return Constants.BSV;
    },
    oppositeNetwork() {
      if (this.network === Constants.TESTNET) return Constants.MAINNET;
      return Constants.TESTNET;
    },
    titleText() {
      if (this.site && this.site === Constants.SITE_ELECTIONS) {
        return "Artis Elections";
      }
      return "Clack Chat";
    }
  }
});
</script>
