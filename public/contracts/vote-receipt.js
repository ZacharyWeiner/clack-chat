export default class VoteReceipt {
  constructor(pk) {
    this.contractTypeID = "388ed8f2-85e8-40a3-9165-3c256adfa32f";
    this.contractTypeName = "VoteReceipt";
    this.contractTypeVersion = "0.0.1";
    this.originalChannel = "Clack.votes";
    this._owners = [pk];
    this.electionId = "";
    this.electionTitle = "";
    this.candidateName = "";
    this.candidatePK = "";
    this.createdOn = Date.now();
    this.locked = false;
  }
  finalizeReceipt(electionRootId, electionTitle, candidateName, candidatePK) {
    if (this.locked === true)
      throw new Error("This vote has already been recorded");
    this.electionId = electionRootId;
    this.electionTitle = electionTitle;
    this.candidateName = candidateName;
    this.candidatePK = candidatePK;
    this.locked = true;
  }
}
