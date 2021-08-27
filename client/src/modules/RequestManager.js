import { API_URL } from "../constants";

export default class RequestManager {
  static async registerUser(credentials) {
    const response = await fetch(`${API_URL}/registerUser`, {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response;
    return result;
  }

  static async getUserData(userAddress) {
    const response = await fetch(API_URL + "/users?userAddress=" + userAddress);
    const data = await response.json();
    if (data.msg) return false;
    return data;
  }
}
