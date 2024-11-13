import { getRandomArbitrary } from "../helpers/randomNumber.js";

class WordGame {
  constructor(words) {
    this.words = words;

    this.container = document.getElementById("app");
    this.placeholders = this.container.querySelector(".word-placeholders");
    this.letters = this.container.querySelector(".word-letters");
    this.tip = this.container.querySelector(".word-tip");
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

    this.letters.appendChild(letterEl);
  }

  renderUiElements(word) {
    word.forEach((letter) => {
      this.renderPlaceholder();
      this.renderLetter(letter);
    });
  }

  correctWord() {
    this.placeholders.querySelectorAll(".word-letter").forEach((el, idx) => {
      el.style.animationDelay = 150 * idx + "ms";

      if (el.textContent.toLowerCase() === this.word[idx].toLowerCase()) {
        el.classList.add("correct");
      } else {
        el.classList.add("incorrect");
      }
    });
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
        const shiftX = e.clientX - target.getBoundingClientRect().left;
        const shiftY = e.clientY - target.getBoundingClientRect().top;

        function moveAt(clientX, clientY) {
          const positionX = clientX - shiftX + "px";
          const positionY = clientY - shiftY + "px";

          target.style.transform = `translate3d(${positionX}, ${positionY}, 0)`;
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
              currentDroppable.replaceWith(target);
            }

            target.style = "";

            document.removeEventListener("mousemove", onMouseMove);
            mouseUpController.abort();

            this.verifyWord();
          },
          { signal: mouseUpSignal }
        );
      }
    });
  }

  scrambleWord(word) {
    const scrambleWord = (word) =>
      word
        .split("")
        .reverse()
        .sort(() => Math.random() - 0.5);
    let scrambledWord = scrambleWord(word);

    while (scrambledWord.join() === word) {
      scrambledWord = scrambleWord(word);
    }

    return scrambledWord;
  }

  init() {
    const drewWord = this.drawRandomWord();

    this.word = drewWord["word"];
    this.tip.textContent = "Dica: " + drewWord["tip"];

    this.scrambledWord = this.scrambleWord(this.word);

    this.renderUiElements(this.scrambledWord);

    this.attachEventListeners();
  }
}

export { WordGame };
