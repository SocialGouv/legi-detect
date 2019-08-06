import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import detectArticles from "./detect.articles";

const SAMPLE_TEXT = `Il était une fois L'Ordonnance n° 2017-95233 du 22 septembre 2017 qui proclama :

1° L'article L. 2232-5 du code du travail est complété par un deuxième alinéa ainsi rédigé :
« Sauf disposition contraire, les termes “ convention de branche ” désignent la convention collective et les accords de branche, les accords professionnels et les accords interbranches. » ;

article L123-11-3 du code du commerce

article 1045 du Code général des impôts

article L1131-1 du code de la défense

2° L'article L. 2232-5-1 est ainsi modifié :
a) Les premier et deuxième alinéas de l'article L. 2232-5-1 sont remplacés par les dispositions suivantes :
« La branche a pour missions :
« 1° De définir les conditions d'emploi et de travail des salariés ainsi que les garanties qui leur sont applicables dans les matières mentionnées aux articles L. 2253-1 et L. 2253-2-42 dans les conditions prévues par lesdits articles. » ;
b) Le 2° de l'article L. 2232-5-1 est supprimé ;
c) Le 3° devient le 2° ;

3° L'article R131-33 du code pénal est complété par un deuxième alinéa ainsi rédigé :
« Sauf disposition contraire, les termes “ convention d'entreprise ” désignent toute convention ou accord conclu soit au niveau de l'entreprise, soit au niveau de l'établissement. » ;

4° Les articles L. 2253-1 à L. 2253-3 sont remplacés par les dispositions suivantes :

4° Les articles R131-24 à R. 131-27 du code pénal sont remplacés par les dispositions suivantes :

4° L'article L. 123-1 du code de la route est remplacé par l'article R131-2 du code pénal et ainsi de suite

`;

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const htmlize = (text, results) =>
  results.reduce((cur, article) => {
    console.log("article.source", article.source);
    return cur.replace(
      new RegExp(`[^>]?(${article.source})`, ""),
      article.url
        ? ` <a target="_blank" href="${article.url}" class="highlight" title="${
            article.fullValue
          }">${article.value}</a>`
        : ` <span class="highlight" title="${article.fullValue}">${
            article.value
          }</span>`
    );
  }, text.replace(/\n/gi, "<br>"));

function App() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [html, setHtml] = useState("");

  const debouncedSearchTerm = useDebounce(text, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const results = detectArticles(text, {
        id: "LEGITEXT000006072050",
        value: "Code du travail"
      });
      console.log("results", results);
      setHtml(htmlize(text, results));
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="App container">
      <h1>article-detect</h1>
      <textarea
        className="form-control"
        onChange={e => setText(e.target.value)}
        style={{ width: "100%", height: 400 }}
        value={text}
      />
      <br />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
