import detectArticles from "./detect.articles";

const tests = [
  { input: `Article D212`, expected: ["Article D212"] },
  { input: `Article D-212`, expected: ["Article D212"] },
  { input: `Article D.212`, expected: ["Article D212"] },
  { input: `Article D212-3`, expected: ["Article D212-3"] },
  { input: `Article D-212-4`, expected: ["Article D212-4"] },
  { input: `Article D.212-5`, expected: ["Article D212-5"] },
  { input: `Article D.212-5-6`, expected: ["Article D212-5-6"] },
  { input: `Article D.212-5-6-7`, expected: ["Article D212-5-6-7"] },
  { input: `Article XD212`, expected: [] },
  {
    input: `Article D212 du code civil`,
    expected: ["Article D212 du Code civil"]
  },
  {
    input: `Article D212 du code pénal`,
    expected: ["Article D212 du Code pénal"]
  },
  {
    input: `Article D212 du code penal et article R413 du code civil`,
    expected: ["Article D212 du Code pénal", "Article R413 du Code civil"]
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
L'article L. 123-1 du code de la route est remplacé par L'article D. 2253-3 du code pénal et ainsi de suite
L'article L. 123-1 du code de la route est remplacé par L'article D. 2253-3 du code pénal et ainsi de suite et l'article D123-4 est OK
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

it("should match a bunch of versions", () => {
  const SAMPLE_TEXT = `Il était une fois L'Ordonnance n° 2017-95233 du 22 septembre 2017 qui proclama :

1° L'article L. 2232-5 du code du travail est complété par un deuxième alinéa ainsi rédigé :
« Sauf disposition contraire, les termes “ convention de branche ” désignent la convention collective et les accords de branche, les accords professionnels et les accords interbranches. » ;

article L123-11-3 du code du commerce

article 1045 du Code général des impôts

article L1131-1 du code de la défense

à l'article Article L311-13 du Code de l'entrée et du séjour des étrangers et du droit d'asile
2° L'article L. 2232-5-1 est ainsi modifié :
a) Les premier et deuxième alinéas de l'article L. 2232-5-1 sont remplacés par les dispositions suivantes :
« La branche a pour missions :
« 1° De définir les conditions d'emploi et de travail des salariés ainsi que les garanties qui leur sont applicables dans les matières mentionnées aux articles L. 2253-1 et D1143-4 dans les conditions prévues par lesdits articles. » ;
b) Le 2° de l'article L. 2232-5-1 est supprimé ;
c) Le 3° devient le 2° ;

les fameux articles L311-13 et  L311-18 du Code de l'entrée et du séjour des étrangers et du droit d'asile.

3° L'article R131-33 du code pénal est complété par un deuxième alinéa ainsi rédigé :
« Sauf disposition contraire, les termes “ convention d'entreprise ” désignent toute convention ou accord conclu soit au niveau de l'entreprise, soit au niveau de l'établissement. » ;

4° Les articles L. 2253-1 à L. 2253-3 sont remplacés par les dispositions suivantes :

4° Les articles R131-24 à R. 131-27 du code pénal sont remplacés par les dispositions suivantes :

4° L'article L. 123-1 du code de la route est remplacé par l'article R131-2 du code pénal et ainsi de suite

`;

  const references = detectArticles(SAMPLE_TEXT, {
    value: "code du test",
    id: "abc"
  });
  expect(references).toMatchSnapshot();
});
