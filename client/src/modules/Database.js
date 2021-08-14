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
    const result = await response.json();
    return result;
  }

  static getUserData(userId) {
    return fetch(API_URL + "/users?userId=" + userId);
  }
}
