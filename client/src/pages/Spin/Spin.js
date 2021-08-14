import React, { useState, useEffect, useRef, Component } from "react";
import styles from "./Spin.module.css";
import SpinTile from "./SpinTile";
import Utils from "../../modules/Utils";
import ConnectionManager from "../../modules/ConnectionManager";
export default function Spin() {
  const HEIGHT = 500;
  const [players, setPlayers] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [winner, setWinner] = useState("");
  const nameRef = useRef(null);
  const amountRef = useRef(null);
  const spinRef = useRef(null);
  const winnerRef = useRef(null);

  const getTotalAmount = (players) => {
    return players.reduce((total, player) => total + player.amount, 0);
  };

  const getPlayersWithSizes = (players, totalAmount) => {
    return [
      ...(players = players.map((player) => {
        return { ...player, size: player.amount / totalAmount };
      })),
    ];
  };

  const randomHexColor = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return "#" + n.slice(0, 6);
  };

  const addPlayer = (newPlayer, players) => {
    console.log(players);
    // let newPlayer = {
    //   name: nameRef.current.value,
    //   amount: parseInt(amountRef.current.value),
    //   color: randomHexColor(),
    // };
    let newPlayers = [...players];

    newPlayers.push(newPlayer);

    let newTotalAmount = getTotalAmount(newPlayers);
    setTotalAmount(newTotalAmount);

    newPlayers = [...getPlayersWithSizes(newPlayers, newTotalAmount)];

    setPlayers([...newPlayers]);
  };

  const spin = () => {
    let minSpinNumber = 1000;
    let maxSpinNumber = 3000;
    let spinNumber = 78; //mocked

    for (let i = 0; i < spinNumber; i++) {
      setTimeout(() => {
        winnerRef.current.textContent =
          "Winner: " +
          Utils.getRandomWinnerWithChances(players).name +
          " " +
          (((i + 1) / spinNumber) * 100).toFixed() +
          "%";
      }, i * 50);
    }
  };

  const endRound = () => {};
  const clearRound = () => {};
  const [connection, setConnection] = useState();

  useEffect(() => {
    let connectionManager = new ConnectionManager(
      addPlayer,
      endRound,
      clearRound
    );
    connectionManager.socket.on("add_player", (player) =>
      addPlayer(player, players)
    );
    setConnection(connectionManager);
  }, []);

  return (
    <div className={styles.spinBox}>
      <div>
        <input placeholder="Name" type="text" ref={nameRef} />
        <input placeholder="Amount" type="number" ref={amountRef} />
        <button
          onClick={() => {
            let newPlayer = {
              name: nameRef.current.value,
              amount: parseInt(amountRef.current.value),
              color: randomHexColor(),
            };
            connection.socket.emit("add_player", newPlayer);
          }}
        >
          Add player
        </button>
        <button onClick={spin}>Spin</button>

        <div className={styles.spin} ref={spinRef}>
          {players.map((player, index) => (
            <SpinTile key={index} player={player} totalAmount={totalAmount} />
          ))}
        </div>
      </div>
      <div>
        <h1 ref={winnerRef}>Winner {winner}</h1>
      </div>
    </div>
  );
}

// export class Spin extends Component {
//   constructor(props) {
//     super(props);

//     this.nameRef = React.createRef();
//     this.amountRef = React.createRef();
//     this.spinRef = React.createRef();
//     this.winnerRef = React.createRef();

//     this.state = {
//       players: [],
//       winner: "",
//       totalAmount: 0,
//     };

//     this.addPlayer = this.addPlayer.bind(this);
//     this.getTotalAmount = this.getTotalAmount.bind(this);
//     this.getPlayersWithSizes = this.getPlayersWithSizes.bind(this);
//     this.randomHexColor = this.randomHexColor.bind(this);
//   }

//   getTotalAmount = (players) => {
//     return players.reduce((total, player) => total + player.amount, 0);
//   };

//   getPlayersWithSizes = (players, totalAmount) => {
//     return [
//       ...(players = players.map((player) => {
//         return { ...player, size: player.amount / totalAmount };
//       })),
//     ];
//   };

//   randomHexColor = () => {
//     let n = (Math.random() * 0xfffff * 1000000).toString(16);
//     return "#" + n.slice(0, 6);
//   };

//   addPlayer = (newPlayer) => {
//     let newPlayers = [...this.state.players];
//     newPlayers.push(newPlayer);
//     let newTotalAmount = this.getTotalAmount(newPlayers);
//     newPlayers = [...this.getPlayersWithSizes(newPlayers, newTotalAmount)];
//     this.setState({
//       ...this.state,
//       players: [...newPlayers],
//       totalAmount: newTotalAmount,
//     });
//   };

//   spin = () => {
//     let minSpinNumber = 1000;
//     let maxSpinNumber = 3000;
//     let spinNumber = 78; //mocked

//     for (let i = 0; i < spinNumber; i++) {
//       setTimeout(() => {
//         this.winnerRef.current.textContent =
//           "Winner: " +
//           Utils.getRandomWinnerWithChances(this.state.players).name +
//           " " +
//           (((i + 1) / spinNumber) * 100).toFixed() +
//           "%";
//       }, i * 50);
//     }
//   };

//   componentDidMount() {
//     this.setState(
//       {
//         ...this.state,
//         connection: new ConnectionManager(
//           this.addPlayer
//           // endRound,
//           // clearRound
//         ),
//       },
//       () => {
//         this.state.connection.socket.on("add_player", (player) => {
//           this.addPlayer(player);
//         });
//       }
//     );
//   }

//   render() {
//     return (
//       <div className={styles.spinBox}>
//         <div>
//           <input placeholder="Name" type="text" ref={this.nameRef} />
//           <input placeholder="Amount" type="number" ref={this.amountRef} />
//           <button
//             onClick={() => {
//               let newPlayer = {
//                 name: this.nameRef.current.value,
//                 amount: parseInt(this.amountRef.current.value),
//                 color: this.randomHexColor(),
//                 size: 1,
//               };
//               this.state.connection.socket.emit("add_player", newPlayer);
//             }}
//           >
//             Add player
//           </button>
//           <button onClick={this.spin}>Spin</button>

//           <div className={styles.spin} ref={this.spinRef}>
//             {this.state.players.map((player, index) => (
//               <SpinTile
//                 key={index}
//                 player={player}
//                 totalAmount={this.totalAmount}
//               />
//             ))}
//           </div>
//         </div>
//         <div>
//           <h1 ref={this.winnerRef}>Winner {this.state.winner}</h1>
//         </div>
//       </div>
//     );
//   }
// }

// export default Spin;
