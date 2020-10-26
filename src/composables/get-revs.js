import { reactive, toRefs } from "vue";

const getRevs = (computer, options = {}) => {
  const state = reactive({
    revs: [],
    status_text: ""
  });

  const initFetch = async () => {
    try {
      state.status_text = "FETCHING";
      const data = await computer.getRevs(computer.db.wallet.getPublicKey());
      state.revs = data;
      state.status_text = "FETCHING_SUCCESS";
    } catch (error) {
      state.status_text = "FETCHING_ERROR";
    }
  };

  if (
    Object.prototype.hasOwnProperty.call(options, "fetchImmediately") &&
    options.fetchImmediately
  ) {
    initFetch();
  }

  return {
    ...toRefs(state),
    initFetch
  };
};

export default getRevs;
