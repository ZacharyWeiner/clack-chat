export default class Chat {
  constructor(publicKey, oc, title) {
    this.contractTypeID = "5529c09a-1402-11eb-adc1-0242ac120002";
    this.contractTypeName = "Chat";
    this.originalChannel = oc;
    this._owners = [publicKey];
    this.title = title;
    this.messages = [];
    this.lastUpdated = null;
    this.archived = false;
  }

  post(pubKey, displayName, message, date) {
    if (this.archived === true)
      return new Error("This Thread is already archived.");
    this.messages.push(`${pubKey}:${displayName}:${message}:${date}`);
  }

  invite(publicKey) {
    if (this.archived === true)
      return new Error("This Thread is already archived.");
    this._owners.push(publicKey);
  }

  archive() {
    this.archived = true;
  }
}
