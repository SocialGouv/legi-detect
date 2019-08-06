import detectCode from "./detect.code";

// poor-man multiline regexp
const RE_ARTICLE =
  "" +
  "\\b" + //                   word start
  "([LRD])\\s*" + //           prefix      LDR
  "[.-\\s]?" + //              separator    -
  "\\s*" + //                  spaces
  "((\\d+(-\\d+){0,3}))" + //  nums        123 123-45 123-45-6 123-45-6-7
  "\\b";

// find and normalize article references
export const detectArticles = str => {
  const matches = str.match(new RegExp(RE_ARTICLE, "gi"));
  return (
    (matches &&
      matches.map(match => {
        const parts = match.match(new RegExp(RE_ARTICLE, "i"));
        console.log("match", str, match, parts);
        return {
          source: match,
          value: `${parts[1]}-${parts[2]}`
          //code: detectCode(str.substring())
        };
      })) ||
    []
  );
};

export default detectArticles;
