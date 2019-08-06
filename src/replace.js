import detectArticles from "./detect.articles";

const replaceRefs = (text, spacing, result) =>
  result.url
    ? ` <a target="_blank" href="${result.url}" class="highlight" title="${
        result.source
      }">${result.value}</a>${spacing}`
    : ` <span class="highlight" title="${result.fullValue}">${
        result.source
      }</span>${spacing}`;

const htmlize = (text, results, replacer = replaceRefs) =>
  results
    .reduce(
      (cur, result) =>
        cur.replace(
          new RegExp(`(${result.source})(\\s)`, ""),
          (_, text, spacing) => replacer(text, spacing, result)
        ),
      text
    )
    .replace(/\n/gi, "<br>");

const replace = (text, defaultCode) => {
  const results = detectArticles(text, defaultCode);
  return htmlize(text, results);
};

export default replace;
