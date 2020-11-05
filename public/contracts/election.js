class Election {
  constructor(
    to,
    distributor,
    title,
    numberOfVotes,
    can1name,
    can1PK,
    can2name,
    can2PK,
    can3name,
    can3PK
  ) {
    this.contractTypeID = "f7469129-5ea8-44ef-8860-1ed6687000b9";
    this.contractTypeName = "Election";
    this.contractTypeVersion = "0.0.1";
    this.originalChannel = "Clack.votes";
    this.votes = numberOfVotes;
    this._owners = [to];
    this.title = title;
    this.can1name = can1name;
    this.can2name = can2name;
    this.can3name = can3name;
    this.cand1PK = can1PK;
    this.cand2PK = can2PK;
    this.cand3PK = can3PK;
    this.distributor = distributor;
  }

  distribute(to) {
    if (this.votes < 1) {
      throw new Error("There are not enough votes to distribute");
    }
    if (this._owners[0].toString() !== this.distributor.toString()) {
      throw new Error("You cannot send your vote to another person.");
    }
    this.votes -= 1;
    return new Election(
      to,
      this.distributor,
      this.title,
      1,
      this.can1name,
      this.cand1PK,
      this.can2name,
      this.cand2PK,
      this.can3name,
      this.cand3PK
    );
  }

  voteA(publicKey) {
    this._owners = [this.cand1PK];
  }

  voteB(publicKey) {
    this._owners = [this.cand2PK];
  }

  voteC(publicKey) {
    this._owners = [this.cand3PK];
  }
}
