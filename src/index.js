import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import detect from "./detect.code";

import legi from "legi-codes-list";

export const RE_ARTICLE = /([LRD])\s*[.-\s]?\s*((\d+(?:-\d+)?))/;

const findReferences = texte =>
  texte && texte.match(/([LR]\s*[.-\s]?\s*\d+(?:-\d+)?)( du code)?/g);

//.map(normalizeReference);
const normalizeReference = ref => {
  const matches = ref.match(/([LRD])\s*[.-\s]?\s*(\d+(?:-\d+)?)/);
  return `${matches[1]}${matches[2]}`;
};

const highlight = (texte, strings) => {
  strings.forEach(string => {
    texte = texte.replace(
      new RegExp(`(${string})`, "gmi"),
      `<span class="highlight">$1</span>`
    );
  });
  return texte;
};

const rmHighlight = html =>
  html.replace(
    new RegExp(`<span class="highlight">([^<]+)</span>`, "gim"),
    "$1"
  );

const getHighlightedHtml = html => highlight(html, findReferences(html));

function App() {
  return (
    <div className="App">
      <h1>article-detect</h1>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
