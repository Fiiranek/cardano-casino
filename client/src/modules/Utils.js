// const serializationLib = require("@emurgo/cardano-serialization-lib-nodejs");
// serializationLib.Transaction
export default class Utils {
  // class Utils {
  static getRandomArrElement = (arr) => {
    let randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  };

  static getRandomWinnerWithChances = (players) => {
    let random = Math.random();
    players = [
      ...players.sort((player1, player2) => player1.size - player2.size),
    ];
    for (let i = 0; i < players.length; i++) {
      if (i === 0) {
        if (random < players[i].size) return players[i];
      } else {
        if (random < players[i].size + players[i - 1].size) return players[i];
      }
    }
  };

  static async getReceiveAddress() {
    if (window.cardano) {
      let baseAddresses = await window.cardano.getUsedAddresses();
      baseAddresses = Utils.convertBaseAddressToCardanoAddress(
        baseAddresses[0]
      );
      return baseAddresses;
    }
    return false;
  }

  static async getSendAddress() {
    if (window.cardano) {
      let baseAddresses = await window.cardano.getUsedAddresses();
      baseAddresses = Utils.convertBaseAddressToCardanoAddress(
        baseAddresses[0]
      );
      return baseAddresses;
    }
    return false;
  }

  static convertBaseAddressToCardanoAddress(baseAddress) {
    // convert

    return baseAddress;
  }

  static shortenAddress(address) {
    const charsStartAndEndNumber = 6;
    return (
      address.substr(0, charsStartAndEndNumber) +
      "..." +
      address.substr(address.length - charsStartAndEndNumber, address.length)
    );
  }

  static getWinner(players) {
    return players.filter((player) => player.winner)[0];
  }

  static isUserWinner(user, players) {
    if (!user) return false;
    let winner = players.filter((player) => player.winner)[0];
    if (!winner) return false;
    if (winner.receive_address === user.receive_address) {
      return true;
    } else {
      return false;
    }
  }

  static calculateWinnerPrize(totalBet) {
    console.log(totalBet);
    const commision = 0.05;
    const prize = totalBet * (1 - this.commision);
    return prize;
  }
}
// let bytesAddr =
//   "018d12641048dbf807e41bc3c84ae90658d9ac0e9cdace1585e2c237d9dc6ea8f9a30a14a5f4240cab68ff639b732cac1a9701bb6b881638fe";
// let addr = serializationLib.Address.from_bech32(
//   "addr1qxx3yeqsfrdlsplyr0pusjhfqevdntqwnndvu9v9utpr0kwud650ngc2zjjlgfqv4d507cumwvk2cx5hqxakhzqk8rlq0ffmkl"
// );
// let stakeAddr = serializationLib.BaseAddress.from_address(addr);
// console.log(stakeAddr.to_address());
// console.log(stakeAddr.payment_cred());
// console.log(stakeAddr.stake_cred());
// console.log(
//   Buffer.from(stakeAddr.to .to_keyhash().to_bytes().buffer).toString("hex")
// );
//console.log(serializationLib.Ed25519Signature.from_hex(bytesAddr));
