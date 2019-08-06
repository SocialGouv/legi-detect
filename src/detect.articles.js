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
export const detectArticles = str => {
  const matches = str.match(new RegExp(RE_ARTICLE, "gi"));
  return (
    (matches &&
      matches.map(match => {
        const parts = match.match(new RegExp(RE_ARTICLE, "i"));
        const codeSearchString = getSubPhraseFromIndex(
          str,
          str.indexOf(match) + match.length
        );
        const code = detectCode(codeSearchString);
        const sourceString = code
          ? str.substring(
              str.indexOf(match),
              str.indexOf(match) + `${match} du ${code.source}`.length
            )
          : str.substring(
              str.indexOf(match),
              str.indexOf(match) + match.length
            );
        return {
          source: sourceString,
          value: `${parts[1]}-${parts[2]}`,
          code
        };
      })) ||
    []
  );
};

export default detectArticles;
