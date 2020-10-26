import { reactive, toRefs } from "vue";
const syncRevs = (computer, revs, options = {}) => {
  const state = reactive({
    objs: [],
    status_text: ""
  });
  const initFetch = async () => {
    if (revs) {
      try {
        state.status_text = "FETCHING";
        console.log("Revs is sync-revs", revs);
        const data = await Promise.all(
          revs.map(async rev => await computer.sync(rev))
        );
        state.objs = data;
        state.status_text = "FETCHING_SUCCESS";
      } catch (error) {
        state.status_text = "FETCHING_ERROR";
      }
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

export default syncRevs;
