import { getRandomArbitrary } from "../helpers/randomNumber.js";
import { Scoreboard } from "./Scoreboard.js";

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
    let currentDroppable = null;

    this.container.addEventListener("mousedown", (e) => {
      const target = e.target.closest(".word-letter");

      if (target) {
        target.classList.add("dragging");
        const shiftX = e.clientX - target.getBoundingClientRect().left;
        const shiftY = e.clientY - target.getBoundingClientRect().top;

        function moveAt(clientX, clientY) {
          const positionX = clientX - shiftX + "px";
          const positionY = clientY - shiftY + "px";

          target.style.left = positionX;
          target.style.top = positionY;
        }

        moveAt(e.clientX, e.clientY);
        target.style.position = "absolute";

        function leaveDroppable(droppable) {
          droppable.classList.remove("highlighted");
        }

        function enterDroppable(droppable) {
          droppable.classList.add("highlighted");
        }

        function onMouseMove(e) {
          if (target) {
            moveAt(e.clientX, e.clientY);

            target.style.pointerEvents = "none";
            let elBelow = document.elementFromPoint(e.clientX, e.clientY);
            target.style.pointerEvents = "initial";

            if (!elBelow) return;

            let droppableBelow = elBelow.closest(".droppable");

            if (currentDroppable != droppableBelow) {
              if (currentDroppable) {
                leaveDroppable(currentDroppable);
              }

              currentDroppable = droppableBelow;

              if (currentDroppable) {
                enterDroppable(currentDroppable);
              }
            }
          }
        }

        document.addEventListener("mousemove", onMouseMove);

        const mouseUpController = new AbortController();
        const mouseUpSignal = mouseUpController.signal;

        document.addEventListener(
          "mouseup",
          () => {
            if (currentDroppable?.classList.contains("droppable")) {
              currentDroppable.appendChild(target);
              currentDroppable.classList.remove("highlighted");
            } else {
              this.letters.prepend(target);
            }

            target.style = "";
            target.classList.remove("dragging");

            document.removeEventListener("mousemove", onMouseMove);
            mouseUpController.abort();

            this.verifyWord();
          },
          { signal: mouseUpSignal }
        );
      }
    });

    this.nextWordEl.addEventListener("click", () => {
      this.nextWord();
    });
  }

  scrambleWord(word) {
    const scrambledWord = word.split("");

    for (let i = scrambledWord.length - 1; i > 1; i--) {
      const j = getRandomArbitrary(0, i);
      const aux = scrambledWord[j];

      scrambledWord[j] = scrambledWord[i];
      scrambledWord[i] = aux;
    }

    return scrambledWord;
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
