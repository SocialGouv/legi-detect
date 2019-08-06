import { detectCode } from "./detect.code";

const tests = `
du code civil et tout
code civille
code civil
code pénal
code penal
du code pennal
du code penal
du code pénal et du code civil et du code de la route
du code de la route
du code de la rue
`
  .split("\n")
  .filter(Boolean);

tests.forEach(test => {
  it(test, () => {
    expect(detectCode(test)).toMatchSnapshot();
  });
});
