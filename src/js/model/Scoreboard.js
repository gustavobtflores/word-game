import { reflow } from "../helpers/reflow.js";

export class Scoreboard {
  constructor() {
    this.scoreboardEl = document.querySelector(".scoreboard");
    this.scoreboardGhostEl = document.querySelector(".scoreboard-ghost");

    this.score = 0;
  }

  changeBy(amount) {
    this.score += amount;
    this.scoreboardGhostEl.textContent = "+" + amount;

    this.render();
  }

  render() {
    reflow(this.scoreboardGhostEl);

    this.scoreboardEl.textContent = this.score;
  }
}
