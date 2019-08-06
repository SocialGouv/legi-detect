import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import detectArticles from "./detect.articles";

const SAMPLE_TEXT = `
Il était une fois L'Ordonnance n° 2017-95233 du 22 septembre 2017 qui proclama :

1° L'article L. 2232-5 du code du travail est complété par un deuxième alinéa ainsi rédigé :
« Sauf disposition contraire, les termes “ convention de branche ” désignent la convention collective et les accords de branche, les accords professionnels et les accords interbranches. » ;

2° L'article L. 2232-5-1 est ainsi modifié :
a) Les premier et deuxième alinéas de l'article L. 2232-5-1 sont remplacés par les dispositions suivantes :
« La branche a pour missions :
« 1° De définir les conditions d'emploi et de travail des salariés ainsi que les garanties qui leur sont applicables dans les matières mentionnées aux articles L. 2253-1 et L. 2253-2 dans les conditions prévues par lesdits articles. » ;
b) Le 2° de l'article L. 2232-5-1 est supprimé ;
c) Le 3° devient le 2° ;

3° L'article L. 2232-11 du code pénal est complété par un deuxième alinéa ainsi rédigé :
« Sauf disposition contraire, les termes “ convention d'entreprise ” désignent toute convention ou accord conclu soit au niveau de l'entreprise, soit au niveau de l'établissement. » ;

4° Les articles L. 2253-1 à L. 2253-3 sont remplacés par les dispositions suivantes :

4° Les articles L. 123-1 du code de la route est remplacé par L. 2253-3 du code pénal et ainsi de suite

`;

function App() {
  console.log("SAMPLE_TEXT", SAMPLE_TEXT);
  const articles = detectArticles(SAMPLE_TEXT, {
    id: "abc",
    value: "Code du travail"
  });
  console.log("articles", articles);
  const text = articles.reduce((cur, article) => {
    return cur.replace(
      article.source,
      `<span class="highlight" title="${article.fullValue}">${
        article.value
      }</span>`
    );
  }, SAMPLE_TEXT);
  return (
    <div className="App">
      <h1>article-detect</h1>
      <div dangerouslySetInnerHTML={{ __html: text }} />
      <pre style={{ padding: 5, background: "#efefef" }}>{SAMPLE_TEXT}</pre>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
