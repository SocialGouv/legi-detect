import detectCode, { maxCodeWordsCount } from "./detect.code";

// poor-man multiline regexp
const RE_ARTICLE =
  "article\\s+([LRD])?\\s*" + //           prefix      Article LDR
  "[.-\\s]?" + //                          separator    -
  "\\s*" + //                              spaces
  "((\\d{1,4}(-\\d+){0,3}))" + //          nums        123 123-45 123-45-6 123-45-6-7
  "\\b";

const getWords = (str, count, startWordIndex = 0) =>
  str
    .trim()
    .split(" ")
    .slice(startWordIndex, count);

const getSubPhraseFromIndex = (str, index, wordsCount = maxCodeWordsCount) =>
  getWords(str.substring(index), wordsCount).join(" ");

// find and normalize article references
export const detectArticles = (str, defaultCode) => {
  const matches = str.match(new RegExp(RE_ARTICLE, "gi"));
  console.log("matches", matches);
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

        startIndex = indexOfArticle;

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

export default detectArticles;
