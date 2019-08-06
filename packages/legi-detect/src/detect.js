const { detectSingle, detectMultiples } = require("./detect.articles");

const detect = (str, defaultCode) => {
  return [
    ...detectSingle(str, defaultCode),
    ...detectMultiples(str, defaultCode)
  ];
};

module.exports = detect;
