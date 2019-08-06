const legi = require("legi-codes-list");
const fuzz = require("fuzzball");

const sortByKey = require("./lib/sortByKey");

const codes = legi.map(code => ({
  id: code.id,
  value: code.titrefull
}));

// the max code length is 18; we focus on 12 wich cover >=85% of cases and improve performance/precision
const maxCodeWordsCount = 12;

// detect the most probable code for a given string with >=85% score required
const detectSingleCode = source => {
  const matches = codes
    .filter(code => (code.etat = "VIGUEUR"))
    .map(code => ({
      code,
      source,
      score: fuzz.ratio(code.value, source)
    }))
    .sort(sortByKey("score"))
    .filter(
      result => result.score >= Math.max(85, 100 - result.code.value.length)
    );
  return matches && matches[0];
};

// detect the most probable code for a given string (using ~maxCodeWordsCount words count)
// maximize precision by trying different words length
const detectCode = str => {
  const matches = Array.from({ length: maxCodeWordsCount }, (v, k) =>
    detectSingleCode(
      str
        .replace(/^(du )/i, "")
        .split(/\n/)[0]
        .split(" ")
        .slice(0, k + 1)
        .join(" ")
    )
  )
    .filter(Boolean)
    .sort(sortByKey("score"));
  const match = matches && matches[0];
  return (
    match && {
      source: match.source,
      ...match.code
    }
  );
};

module.exports = { detectCode, maxCodeWordsCount };
