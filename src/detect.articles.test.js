import { detectArticles } from "./detect.articles";

const tests = [
  { input: `Article D212`, expected: ["D-212"] },
  { input: `Article D-212`, expected: ["D-212"] },
  { input: `Article D.212`, expected: ["D-212"] },
  { input: `Article D212-3`, expected: ["D-212-3"] },
  { input: `Article D-212-4`, expected: ["D-212-4"] },
  { input: `Article D.212-5`, expected: ["D-212-5"] },
  { input: `Article D.212-5-6`, expected: ["D-212-5-6"] },
  { input: `Article D.212-5-6-7`, expected: ["D-212-5-6-7"] },
  { input: `Article XD212`, expected: [] },
  { input: `Article D212 du code civil`, expected: ["D-212"] },
  { input: `Article D212 du code pénal`, expected: ["D-212"] }
];

// add tests for variants
tests.forEach(test => {
  // in some text
  tests.push({
    input: `random text ${test.input} random text`,
    expected: test.expected
  });
  // multiple matches
  tests.push({
    input: `random text ${test.input} random text ${test.input} random text`,
    expected:
      (test.expected.length && test.expected.concat(test.expected[0])) || []
  });
  // multilines
  tests.push({
    input: `random text
${test.input} random

text ${test.input}

random text`,
    expected:
      (test.expected.length && test.expected.concat(test.expected[0])) || []
  });
});

tests.forEach(test => {
  it(`${test.input} => ${test.expected.join(", ")}`, () => {
    const references = detectArticles(test.input);
    if (!test.expected.length) {
      expect(references.length).toEqual(0);
    } else {
      expect(references.map(ref => ref.value)).toEqual(test.expected);
    }
    expect(references).toMatchSnapshot();
  });
});

it.only("aaz", () => {
  const references = detectArticles(
    "Article D123-1 du code pénal et D234-2 du code civil"
  );
  console.log("references", references);
});
