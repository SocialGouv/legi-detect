import detectCode, { maxCodeWordsCount } from "./detect.code";

// poor-man multiline regexp
const RE_ARTICLE =
  "" +
  "\\b" + //                   word start
  "([LRD])\\s*" + //           prefix      LDR
  "[.-\\s]?" + //              separator    -
  "\\s*" + //                  spaces
  "((\\d+(-\\d+){0,3}))" + //  nums        123 123-45 123-45-6 123-45-6-7
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
  let startIndex = 0;
  return (
    (matches &&
      matches.map(match => {
        const indexOfArticle = str.indexOf(match, startIndex);

        const parts = match.match(new RegExp(RE_ARTICLE, "i"));
        const article = {
          source: match,
          value: `${parts[1]}-${parts[2]}`
        };

        const codeSearchString = getSubPhraseFromIndex(
          str,
          indexOfArticle + match.length
        );

        const code = detectCode(codeSearchString);

        const sourceString = code
          ? str.substring(
              indexOfArticle,
              indexOfArticle + `${match} du ${code.source}`.length
            )
          : str.substring(indexOfArticle, indexOfArticle + match.length);

        const valueString = code
          ? `${article.value} du ${code.value}`
          : `${article.value}`;

        const fullValueString =
          code || defaultCode
            ? `${article.value} du ${(code || defaultCode).value}`
            : `${article.value}`;

        startIndex = indexOfArticle;

        return {
          source: sourceString,
          fullValue: fullValueString,
          value: valueString,
          article,
          code: code || defaultCode
        };
      })) ||
    []
  );
};

export default detectArticles;
