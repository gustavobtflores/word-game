import { WordGame } from "./model/WordGame.js";
import words from "./words.js";

const wordGame = new WordGame(words);

wordGame.init();
