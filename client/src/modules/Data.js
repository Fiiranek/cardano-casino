export default class Data {
  toJson() {
    let json = {};
    Object.keys(this).forEach((key) => (json[key] = this[key]));
    return json;
  }
}
