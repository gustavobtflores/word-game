import { getRandomArbitrary } from "../helpers/randomNumber.js";
import { shuffle } from "../helpers/shuffle.js";
import { Scoreboard } from "./Scoreboard.js";
import { DragDrop } from "./DragDrop.js";

class WordGame {
  constructor(words) {
    this.words = words;

    this.container = document.getElementById("app");
    this.placeholders = this.container.querySelector(".word-placeholders");
    this.letters = this.container.querySelector(".word-letters");
    this.tip = this.container.querySelector(".word-tip");
    this.nextWordEl = this.container.querySelector("#next-word");

    this.scoreboard = new Scoreboard();
  }

  drawRandomWord() {
    return this.words[getRandomArbitrary(0, this.words.length)];
  }

  renderPlaceholder() {
    const placeholderEl = document.createElement("span");

    placeholderEl.classList.add("word-placeholder", "droppable");

    this.placeholders.appendChild(placeholderEl);
  }

  renderLetter(letter) {
    const letterEl = document.createElement("span");

    letterEl.classList.add("word-letter");
    letterEl.textContent = letter;
    letterEl.draggable = false;

    this.letters.appendChild(letterEl);
  }

  renderUiElements(word) {
    this.placeholders.replaceChildren();
    this.letters.replaceChildren();

    word.forEach((letter) => {
      this.renderPlaceholder();
      this.renderLetter(letter);
    });
  }

  endCycle() {
    this.nextWordEl.classList.add("show");
  }

  correctWord() {
    let userWord = "";

    this.placeholders.querySelectorAll(".word-letter").forEach((el, idx) => {
      el.style.animationDelay = 150 * idx + "ms";
      userWord += el.textContent;

      if (el.textContent.toLowerCase() === this.word[idx].toLowerCase()) {
        el.classList.add("correct");
      } else {
        el.classList.add("incorrect");
      }
    });

    this.scoreboard.compute(userWord, this.word);
    this.endCycle();
  }

  verifyWord() {
    let userWord = "";

    this.placeholders.querySelectorAll(".word-letter").forEach((el) => {
      userWord += el.textContent;
    });

    if (this.word.length === userWord.length) {
      this.correctWord();
    }
  }

  attachEventListeners() {
    this.dragDrop = new DragDrop(this.container, () => {
      this.verifyWord();
    });

    this.nextWordEl.addEventListener("click", () => {
      this.nextWord();
    });
  }

  scrambleWord(word) {
    const scrambledWord = word.split("");

    return shuffle(scrambledWord);
  }

  nextWord() {
    const drewWord = this.drawRandomWord();

    this.word = drewWord["word"];
    this.tip.textContent = drewWord["tip"];

    this.scrambledWord = this.scrambleWord(this.word);

    this.renderUiElements(this.scrambledWord);

    this.nextWordEl.classList.remove("show");
  }

  init() {
    this.nextWord();
    this.attachEventListeners();
  }
}

export { WordGame };
