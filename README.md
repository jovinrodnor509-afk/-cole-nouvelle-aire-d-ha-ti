# École Nouvelle Ayiti

Platfòm aprantisaj an Kreyòl pou Primè, Segondè, ak Metye (kouti, mekanik, elektrisite, kwafi, kwizin).

## Estrikti

Tout fichye yo rete **plat** (pa gen dosye) — sa fasilite upload sou telefòn san GitHub melanje non fichye yo:

```
ecole-nouvelle-ayiti/
├── index.html          → Paj prensipal (accueil, twa chemen yo)
├── style.css             → Tout style yo, pataje pou chak paj
├── firebase-config.js   → Konfigirasyon Firebase (mete kle ou yo la)
├── main.js               → Lojik front-end (byento: auth, aksè peye)
├── prime.html           → Plasholder seksyon Primè
├── segonde.html         → Plasholder seksyon Segondè
└── metye.html           → Plasholder seksyon Metye
```

## Sa ki fèt deja
- Paj prensipal la konplè, ak idantite vizyèl distenk (koray pou Primè, endigo pou Segondè, vèt pou Metye)
- Estrikti dosye pou chak seksyon, avèk paj "byento" pou yo pa 404
- Modèl konfigirasyon Firebase, pare pou ou mete kle pwòp pwojè a
- Entegrasyon peman MonCash (gade dosye `moncash-integration` yo te resevwa anvan an — kòd sa a jenerik, li ka konekte dirèkteman ak pwojè sa a)

## Pwochèn etap
1. Kreye pwojè Firebase separe pou École Nouvelle Ayiti (pa menm ak STOA)
2. Mete kle yo nan `js/firebase-config.js`
3. Deside: èske chak seksyon (Primè/Segondè/Metye) ap gen menm kalite kontni ak STOA (videyo + liv), oswa yon lòt fòma?
4. Ranpli seksyon Primè a an premye ak vrè kontni (li gen plis chans gen plis moun ki enterese kòmanse)
5. Konekte bouton "Konekte" ak Firebase Auth
6. Konekte MonCash pou aksè peye (dosye `moncash-integration`)

## Deplwaman
Menm apwòch ak STOA: push kòd la sou yon repo GitHub, aktive GitHub Pages nan Settings, epi sit la ap disponib gratis.
