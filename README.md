# legi-detect

Détecte des citations de textes issus de la base LEGI. Dans le browser, côté serveur (NodeJS), ou via API HTTP.

[Demo : Playground](https://socialgouv.github.io/legi-detect/)

## Usage

### Javascript

```js
import { replace } from "@socialgouv/legi-replace";

const texte = `cf article L123-11-3 du code du commerce`;

const html = replace(text);

// on peut initialiser un code par défaut pour le "contexte"
const texte = `cf article L1111-1 du présent code et article L123-11-3 du code du commerce`;

const html = replace(texte, {
  id: "LEGITEXT000006071307",
  value: "Code de la défense"
});
```

### API

```sh
docker run -e PORT=3010 -e 3010=3010 @socialgouv/legi-detect

curl -d '{"text":"cf article L1111-1  du présent code et article L123-11-3 du code du commerce", "code": {"id": "LEGITEXT000006071307", "value": "Code de la défense"}}' -H "Content-Type:application/json" -X POST http://127.0.0.1:3010
```

### Résultat

```html
cf
<a
  target="_blank"
  href="https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000020932648&cidTexte=LEGITEXT000006071307"
  class="highlight"
  title="article L1111-1"
  >article L1111-1</a
>
ici ou
<a
  target="_blank"
  href="https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000020196876&cidTexte=LEGITEXT000005634379"
  class="highlight"
  title="article L123-11-3 du code du commerce"
  >article L123-11-3 du code du commerce</a
>
```

### Todo

- use [legi-data](https://github.com/SocialGouv/legi-data) as data-source
