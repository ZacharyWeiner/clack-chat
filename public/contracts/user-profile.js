export default class UserProfile {
  constructor(
    pubKey,
    oc,
    displayName,
    url,
    bio,
    image,
    position,
    company,
    companyUrl
  ) {
    this.contractTypeID = "964001a2-140c-11eb-adc1-0242ac120002";
    this.contractTypeName = "UserProfile";
    this.contractTypeVersion = "0.0.1";
    this.originalChannel = oc;
    this._owners = [pubKey];
    this.displayName = displayName;
    this.url = url;
    this.bio = bio;
    this.image = image;
    this.position = position;
    this.company = company;
    this.companUrl = companyUrl;
  }

  setDisplayName(name) {
    this.displayName = name;
  }

  setUrl(url) {
    this.url = url;
  }

  setBio(bioAsMarkdown) {
    this.bio = bioAsMarkdown;
  }

  setImage(imageUrl) {
    this.image = imageUrl;
  }

  setPosition(position) {
    this.position = position;
  }

  setCompany(companyName) {
    this.company = companyName;
  }

  setCompanyUrl(companyUrl) {
    this.companyUrl = companyUrl;
  }
}
