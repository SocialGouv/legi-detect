import legi from "legi-codes-list";
import fuzz from "fuzzball";

import sortByKey from "./lib/sortByKey";

const codes = legi.map(code => ({
  id: code.id,
  titre: code.titre
}));

// the max code length is 18; we focus on 12 wich cover +95% of cases and improve performance
const maxCodeWordsCount = 12;

// detect the most probable code for a given string with 95% score required
const detectSingleCode = source => {
  const matches = codes
    .map(code => ({
      code,
      source,
      score: fuzz.ratio(code.titre, source)
    }))
    .sort(sortByKey("score"))
    .filter(result => result.score > 95);
  return matches && matches[0];
};

// detect the most probable code for a given string (using ~maxCodeWordsCount words count)
// maximize precision by trying different words length
export const detectCode = str => {
  const matches = Array.from({ length: maxCodeWordsCount }, (v, k) =>
    detectSingleCode(
      str
        .replace(/^(du )/i, "")
        .split(" ")
        .slice(0, k + 2)
        .join(" ")
    )
  )
    .filter(Boolean)
    .sort(sortByKey("score"));
  return matches && matches[0];
};

export default detectCode;
