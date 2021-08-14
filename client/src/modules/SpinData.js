import Data from "./Data";
export default class SpinData extends Data {
  constructor(userId, amount) {
    super();
    this.userId = userId;
    this.amount = amount;
  }
}
