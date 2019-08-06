import detectCode, { maxCodeWordsCount } from "./detect.code";

// poor-man multiline regexps

const SINGLE_ARTICLE =
  "([LRD])?\\s*" + //           prefix      Article LDR
  "[.-\\s]?" + //                          separator    -
  "\\s*" + //                              spaces
  "((\\d{1,4}(-\\d+){0,3}))"; //          nums        123 123-45 123-45-6 123-45-6-7

const RE_ARTICLE = "article\\s+" + SINGLE_ARTICLE + "\\b";

const RE_ARTICLES =
  "articles\\s+" + SINGLE_ARTICLE + "\\s+(a|à|et)\\s+" + SINGLE_ARTICLE + "\\b";

const getWords = (str, count, startWordIndex = 0) =>
  str
    .trim()
    .split(" ")
    .slice(startWordIndex, count);

const getSubPhraseFromIndex = (str, index, wordsCount = maxCodeWordsCount) =>
  getWords(str.substring(index), wordsCount).join(" ");

const detectMultiples = (str, defaultCode) => {
  const matches = str.match(new RegExp(RE_ARTICLES, "gi"));
  let startIndex = 0;
  return (
    matches &&
    matches.map(match => {
      const parts = match.match(new RegExp(RE_ARTICLES, "i"));
      const articles = [
        `${parts[1] || ""}${parts[2]}`,
        `${parts[6] || ""}${parts[7]}`
      ];
      const indexOfArticles = str.indexOf(match, startIndex);

      const operator = parts[5];

      const codeSearchString = getSubPhraseFromIndex(
        str,
        indexOfArticles + match.length
      );

      startIndex = indexOfArticles + match.length;

      const detectedCode = detectCode(codeSearchString);

      const sourceString = detectedCode
        ? str.substring(
            indexOfArticles,
            indexOfArticles + `${match} du ${detectedCode.source}`.length
          )
        : str.substring(indexOfArticles, indexOfArticles + match.length);

      const valueString = detectedCode
        ? `Articles ${articles[0]} ${operator} ${articles[1]} du ${
            detectedCode.value
          }`
        : `Articles ${articles[0]} ${operator} ${articles[1]}`;

      const code = detectedCode || defaultCode;

      const fullValueString = code
        ? `Articles ${articles[0]} ${operator} ${articles[1]} du ${code.value}`
        : `Articles ${articles[0]} ${operator} ${articles[1]}`;

      let url;
      if (code) {
        try {
          const codeData = require(`./data/articles/${code.id}.json`);
          const id = codeData[articles[0]];
          if (id) {
            url = `https://www.legifrance.gouv.fr/affichCode.do?idArticle=${id}&cidTexte=${
              code.id
            }`;
          }
        } catch (e) {
          console.log("e", e);
        }
      }
      return {
        source: sourceString,
        fullValue: fullValueString,
        value: valueString,
        //article,
        code,
        url
      };
    })
  );
};

// find and normalize article references
export const detectSingle = (str, defaultCode) => {
  const matches = str.match(new RegExp(RE_ARTICLE, "gi"));
  console.log("matches", matches);
  console.log("detectMultiples", detectMultiples(str, defaultCode));
  let startIndex = 0;
  return (
    (matches &&
      matches.map(match => {
        const indexOfArticle = str.indexOf(match, startIndex);

        const parts = match.match(new RegExp(RE_ARTICLE, "i"));
        const article = {
          source: match,
          value: `${parts[1] || ""}${parts[2]}`
        };

        const codeSearchString = getSubPhraseFromIndex(
          str,
          indexOfArticle + match.length
        );

        const detectedCode = detectCode(codeSearchString);

        const sourceString = detectedCode
          ? str.substring(
              indexOfArticle,
              indexOfArticle + `${match} du ${detectedCode.source}`.length
            )
          : str.substring(indexOfArticle, indexOfArticle + match.length);

        const valueString = detectedCode
          ? `Article ${article.value} du ${detectedCode.value}`
          : `Article ${article.value}`;

        const code = detectedCode || defaultCode;

        const fullValueString = code
          ? `Article ${article.value} du ${code.value}`
          : `Article ${article.value}`;

        startIndex = indexOfArticle + match.length;

        let url;
        // console.log("code", code);
        if (code) {
          try {
            const articles = require(`./data/articles/${code.id}.json`);
            const id = articles[article.value];
            if (id) {
              url = `https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=${id}&cidTexte=${
                code.id
              }`;
            }
          } catch (e) {
            console.log("e", e);
          }
        }
        return {
          source: sourceString,
          fullValue: fullValueString,
          value: valueString,
          article,
          code,
          url
        };
      })) ||
    []
  );
};

const detectArticles = (str, defaultCode) => {
  return [
    ...detectSingle(str, defaultCode),
    ...detectMultiples(str, defaultCode)
  ];
};
export default detectArticles;
