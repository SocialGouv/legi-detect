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
  { input: `Article D212 du code civil`, expected: ["D-212 du Code civil"] },
  { input: `Article D212 du code pénal`, expected: ["D-212 du Code pénal"] },
  {
    input: `Article D212 du code penal et R413 du code civil`,
    expected: ["D-212 du CODE PENAL", "R-413 du Code civil"]
  }
];

// add tests for variants
tests.forEach(t => {
  // in some text
  tests.push({
    input: `random text ${t.input} random text`,
    expected: t.expected
  });
  // multiple matches
  tests.push({
    input: `random text ${t.input} random text ${t.input} random text`,
    expected: (t.expected.length && t.expected.concat(...t.expected)) || []
  });
  // multilines
  tests.push({
    input: `random text
  ${t.input} random

  text ${t.input}

  random text`,
    expected: (t.expected.length && t.expected.concat(...t.expected)) || []
  });
});

tests.forEach(t => {
  it(`${t.input.replace(/\n/gm, " ")} => ${t.expected.join(", ")}`, () => {
    const references = detectArticles(t.input);
    if (!t.expected.length) {
      expect(references.length).toEqual(0);
    } else {
      expect(references.map(ref => ref.value)).toEqual(t.expected);
    }
    expect(references).toMatchSnapshot();
  });
});

const tests2 = `
Article D.212-5-6
Les articles L. 123-1 du code de la route est remplacé par L. 2253-3 du code pénal et ainsi de suite
Les articles L. 123-1 du code de la route est remplacé par L. 2253-3 du code pénal et ainsi de suite et l'article D123-4 est OK
`
  .split("\n")
  .filter(Boolean);

tests2.forEach(t => {
  it(`should use defaultCode for ${t}`, () => {
    const references = detectArticles(t, {
      value: "code du test",
      id: "abc"
    });
    expect(references).toMatchSnapshot();
  });
});
