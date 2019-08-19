const detect = require("./detect");

const replaceRefs = (text, spacing, result) =>
  result.url
    ? ` <a target="_blank" href="${result.url}" class="highlight" title="${
        result.value
      }">${result.source}</a>${spacing}`
    : ` <span class="highlight" title="${result.fullValue.replace(/"/g, "")}">${
        result.value
      }</span>${spacing}`;

const htmlize = (text, results, replacer = replaceRefs) =>
  results
    .reduce(
      (cur, result) =>
        cur.replace(
          new RegExp(`(${result.source})(\\s|\\))`),
          (_, text, spacing) => replacer(text, spacing, result)
        ),
      ` ${text} `
    )
    .replace(/\n/gi, "<br>");

const replace = (text, defaultCode) => {
  const results = detect(text, defaultCode);
  return htmlize(text, results).trim();
};

module.exports = replace;
