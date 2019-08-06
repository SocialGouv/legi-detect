# legi-detect

Détecte des citations de textes issus de la base LEGI.

[Demo : Playground](https://socialgouv.github.io/legi-detect)

## Packages

- legi-detect : extrait une liste d'articles cités
- legi-replace : ajoute des liens dans un texte donné

## Usage

```js
import { replace } from "@socialgouv/legi-replace";

const texte = `cf article L123-11-3 du code du commerce`;

const html = replace(text);

// on peut initialiser un code par défaut pour le "contexte"
const texte = `cf article L1131-1 du présent code et article L123-11-3 du code du commerce`;

const html = replace(text, {
  id: "LEGITEXT000006071307",
  value: "Code de la défense"
});

// dump html
```
