export default class UserProfile {
  constructor(
    pubKey,
    oc,
    displayName,
    website,
    bio,
    image,
    jobTitle,
    company,
    companyUrl
  ) {
    this.contractTypeID = "964001a2-140c-11eb-adc1-0242ac120002";
    this.contractTypeName = "UserProfile";
    this.contractTypeVersion = "0.0.1";
    this.originalChannel = oc;
    this._owners = [pubKey];
    this.manager = pubKey;
    this.displayName = displayName;
    this.website = website;
    this.bio = bio;
    this.image = image;
    this.jobTitle = jobTitle;
    this.company = company;
    this.companyUrl = companyUrl;
  }

  setDisplayName(name) {
    this.displayName = name;
  }

  setWebsite(website) {
    this.website = website;
  }

  setBio(bioAsMarkdown) {
    this.bio = bioAsMarkdown;
  }

  setImage(imageUrl) {
    this.image = imageUrl;
  }

  setJobTitle(jobTitle) {
    this.jobTitle = jobTitle;
  }

  setCompany(companyName) {
    this.company = companyName;
  }

  setCompanyUrl(companyUrl) {
    this.companyUrl = companyUrl;
  }

  shareWith(pubKey) {
    //how do I get the public key of the user making the request?
    //if the user is not the manager, I do not want to allow the user to make a change here
    //even if they are the owner.
    this._owners.push(pubKey);
  }

  removeShare(pubKey) {
    let _temp = this._owners;
    let index = _temp.indexOf(pubKey);
    if (index === -1) {
      throw new Error("The key does not exist in the shared list");
    }
    _temp.splice(index, 1);
    this._owners = _temp;
  }
}
