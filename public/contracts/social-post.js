export default class SocialPost {
  constructor(pubKey, oc, profileAddress, postType, title, body, links, tags) {
    this.contractTypeID = "5ab5db8b-09c0-4e7a-b487-903b01f70e11";
    this.contractTypeName = "SocialPost";
    this.contractTypeVersion = "0.0.1";
    this.originalChannel = oc;
    this._owners = [pubKey];
    this.postType = postType;
    this.title = title;
    this.body = body;
    this.links = links;
    this.tags = tags;
    this.posted_on = new Date.now.toString();
    this.profileAddress = profileAddress;
  }
  updateTitle(title) {
    if (!title || title === "") throw new Error("The title can not be empty");
    this.title = title;
  }
  updateBody(body) {
    if (!body || body === "") throw new Error("The body can not be empty");
    this.body = body;
  }
  addLink(link) {
    if (!link.includes("http") || !link.includes("www."))
      throw new Error("Must be a valid web url with 'http' or 'www.'");
    this.links.push(link);
  }
  removeLink(link) {
    let index = this.links.indexOf(link);
    if (index == -1)
      throw new Error("This link does not exist in the list of Links");
    this.links = this.links.splice(index, 1);
  }

  addTag(tag) {
    if (!tag || tag === "")
      throw new Error("Can not add an empty tag to the collection");
    this.tags.push(tag);
  }
  removeTag(tag) {
    let index = this.tags.indexOf(tag);
    if (index == -1)
      throw new Error("This tag does not exist in the list of tags");
    this.tags = this.tags.splice(index, 1);
  }
  updateProfileAddress(profileAddress) {
    this.profileAddress = profileAddress;
  }
}
