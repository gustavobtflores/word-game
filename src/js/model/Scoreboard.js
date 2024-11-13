export class Scoreboard {
  constructor() {
    this.scoreboardEl = document.querySelector(".scoreboard");
    this.score = 0;
  }

  changeBy(amount) {
    this.score += amount;
    this.render();
  }

  render() {
    this.scoreboardEl.textContent = this.score;
  }
}
