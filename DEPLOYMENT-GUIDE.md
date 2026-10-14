# Deplwaye MonCash — École Nouvelle Ayiti
Gid konplè pou lè w gen aksè a laptop Dell la (konekte ak hotspot telefòn ou).

## 0. Anvan w kòmanse
- [ ] Upgrade pwojè Firebase a pou plan **Blaze** (console.firebase.google.com → ecole-nouvelle-ayiti → anba agoch "Spark" → "Mettre à niveau" → chwazi Blaze → antre yon kat, egzanp kat vityèl OMNI Kredi/KatVit ou)
- [ ] Jwenn **Client ID** ak **Client Secret** MonCash Business ou (nan moncashbutton.digicelgroup.com)

## 1. Enstale sa w bezwen sou laptop la
Si Node.js poko enstale, telechaje l sou **nodejs.org** (vèsyon "LTS"), enstale l.

Louvri yon tèminal (sou Windows: "Command Prompt" oswa "PowerShell"), epi tape:
```
npm install -g firebase-tools
```

## 2. Konekte ak kont Google ou
```
firebase login
```
Yon paj navigatè ap louvri — konekte ak **menm kont Google** ki gen pwojè Firebase a.

## 3. Prepare dosye travay la
Kreye yon nouvo dosye nenpòt kote sou laptop la (egzanp sou Desktop), rele l `ena-moncash`, epi antre ladan nan tèminal la:
```
mkdir ena-moncash
cd ena-moncash
firebase init functions
```

Lè l mande kesyon:
- "Please select an option" → **Use an existing project**
- Chwazi **ecole-nouvelle-ayiti**
- Language → **JavaScript**
- ESLint → **No**
- Install dependencies now → **Yes**

Sa ap kreye yon dosye `functions/` ladan.

## 4. Ranplase kòd la
Nan dosye `ena-moncash/functions/`, ou ap jwenn yon `index.js` ak yon `package.json` Firebase te jenere.

**Ranplase tou de** ak fichye mwen prepare pou ou yo: `index.js` ak `package.json` (ki nan menm zip sa a). Kopye-kole kontni yo, oswa ranplase fichye yo dirèkteman.

## 5. Mete kle sekrè MonCash yo
Toujou nan tèminal la, nan dosye `ena-moncash`:
```
firebase functions:secrets:set MONCASH_CLIENT_ID
```
L ap mande w kole valè a → kole Client ID MonCash ou, Enter.
```
firebase functions:secrets:set MONCASH_CLIENT_SECRET
```
Menm bagay ak Client Secret la.

## 6. Deplwaye
```
firebase deploy --only functions
```
Tann 2-5 minit. Lè l fini, li ap montre w de lyen tankou:
```
https://us-central1-ecole-nouvelle-ayiti.cloudfunctions.net/createMoncashPayment
https://us-central1-ecole-nouvelle-ayiti.cloudfunctions.net/moncashReturn
```

## 7. Konfigire MonCash Business
Nan dashboard MonCash Business ou, mete **Return URL** la ak lyen `moncashReturn` ki anwo a.

## 8. Teste
Sou sit la, konekte, ale nan Primè, klike yon bouton "Peye pou jwenn aksè". Si tout bagay byen branche, MonCash ap louvri, epi apre peman tès la (an sandbox), ou dwe tounen sou sit la ak aksè "aktif".

## 9. Pase an "live" (lè w pare pou vrè lajan)
1. Jwenn kle **live** MonCash yo (pa sandbox)
2. `firebase functions:secrets:set MONCASH_CLIENT_ID` ankò ak nouvo valè live la
3. Menm bagay pou `MONCASH_CLIENT_SECRET`
4. Nan `functions/index.js`, chanje `const MODE = 'sandbox';` pou `const MODE = 'live';`
5. `firebase deploy --only functions` ankò

## Si yon bagay pa mache
Pran yon screenshot mesaj erè ki parèt nan tèminal la, voye l ban mwen, m ap gide w.
