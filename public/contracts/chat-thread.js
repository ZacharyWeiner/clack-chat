export default class Chat {
  constructor(publicKey, oc, title) {
    this.contractTypeID = "5529c09a-1402-11eb-adc1-0242ac120002";
    this.contractTypeName = "Chat";
    this.contractTypeVersion = "0.0.1";
    this.originalChannel = oc;
    this._owners = publicKey;
    this.title = title;
    this.messages = [];
    this.lastUpdated = null;
    this.canArchive = publicKey;
    this.archived = false;
  }

  post(messageAsJson) {
    if (this.archived === true)
      return new Error("This Thread is already archived.");
    this.messages.push(messageAsJson);
  }

  invite(publicKey) {
    if (this.archived === true)
      return new Error("This Thread is already archived.");
    this._owners.push(publicKey);
  }

  archive(pubKey) {
    if (!this.canArchive.includes(pubKey))
      return new Error("You do not have permission to archive this thread");
    this.archived = true;
  }
}
