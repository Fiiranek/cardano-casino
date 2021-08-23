import { API_URL } from "../constants";

export default class Database {
  static async registerUser(credentials) {
    const response = await fetch(`${API_URL}/registerUser`, {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    });
    //const result = await response.json();
    const result = await response;
    return result;
  }

  // static getUserData(userId) {
  //   return fetch(API_URL + "/users?userId=" + userId);
  // }

  static async getUserData(userReceiveAddress) {
    const response = await fetch(
      API_URL + "/users?userReceiveAddress=" + userReceiveAddress
    );
    const data = await response.json();
    if (data.msg) return false;
    return data;
  }
}
