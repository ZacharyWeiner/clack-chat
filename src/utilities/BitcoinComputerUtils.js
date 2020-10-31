export default class BitcoinComputerUtils {
  static async getLatestSmartObjectRevisionIds(computer, publicKey) {
    let latestRevisionIdsOrError = null;
    try {
      latestRevisionIdsOrError = await computer.getRevs();
    } catch (err) {
      latestRevisionIdsOrError = err;
      console.log(
        `An Error occurred in BitcoinComputerUtils on getLatestSmartObjectRevisionIds for PublicKey: \n ${publicKey}`
      );
    }
    return latestRevisionIdsOrError;
  }
}
