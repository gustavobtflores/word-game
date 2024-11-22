import { reflow } from "../helpers/reflow.js";

export class Scoreboard {
  constructor() {
    this.scoreboardEl = document.querySelector(".scoreboard");
    this.scoreboardGhostEl = document.querySelector(".scoreboard-ghost");

    this.score = 0;
  }

  compute(expected, received) {
    let score = 0;

    expected.split("").forEach((letter, idx) => {
      if (received[idx] === letter) {
        score++;
      } else {
        score--;
      }
    });

    this.changeBy(score);
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
