const API_KEY = require("./config/config").API_KEY;

class Utils {
  static verifyApiKey(key) {
    if (key === API_KEY) {
      return true;
    } else {
      return false;
    }
  }
}
module.exports = Utils;
