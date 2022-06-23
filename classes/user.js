class user {
  constructor(username, socket) {
    this.username = username;
    this.socket = socket;
  }
  setDuel(duel) {
    this.duel = duel;
  }
}
module.exports = user;
