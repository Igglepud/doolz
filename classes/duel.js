class duel {
  constructor(username1, username2, socketList) {
    this.username1 = username1;
    this.username2 = username2;
    this.status = "new";
    this.socketList = socketList;
    this.winner = false;
  }
  heartbeat() {
    if (this.status === false) {
      return;
    }
    if (this.status == "finished") {
      return -1;
    }
    console.log("duel.status" + this.status);
    if (this.status == "new") {
      this.status = 10;
    } else if (this.status > 0) {
      this.status--;
    } else if (this.status <= 0) {
      console.log("dueling");
      this.draw();
      this.status = false;
    }
  }

  draw() {
    this.socketList[this.username1].socket.emit("Draw!");
    this.socketList[this.username2].socket.emit("Draw!");
  }

  getPlayers() {
    return [this.socketList[this.username1], this.socketList[this.username2]];
  }

  endDuel(username) {
    if (!this.winner) {
      this.winner = username;
      this.socketList[this.username1].socket.emit("end duel");
      this.socketList[this.username2].socket.emit("end duel");
      this.status = "finished";
      this.socketList[this.username1].duel = null;
      this.socketList[this.username2].duel = null;
      return this.winner;
    }
  }
}

module.exports = duel;
