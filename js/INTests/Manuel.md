# Manuel INTests



C’est encore une nouvelle tentative pour produire des tests de l’intérieur.

Les principes :

* chaque test recharge la page
* chaque fiche de test (fichier .js) produit un seul test
* chaque test définit l’état de départ
* les résultats sont enregistrés en `localStorage` et un rapport est produit à la fin.



## Fonctionnement général

Au chargement, avant de charger les données `Montrello`, un script Ajax est appelé pour voir si on doit jouer les tests. Si c’est le cas, on prépare les données du premier test et on remonte son nom.

À l’aide de son nom, on charge le test en question, qui est joué et évalué.

Puis on recharge la page pour faire le test suivant (s’il existe).

## Les tests

### Création d’un test

~~~javascript
// Dans js/INTests/tests/mon_premier_test/test.js
// si le test s'appelle 'mon_premier_test'

'use strict'

INTests.define("Le nom de mon test", async function(){
  
  // ... évaluation ...
  
  return le_resultat
})
~~~

### Retour de test

Un test (sa fonction) doit toujours retourner un résultat qui est soit :

* `true` => le test a réussi
* `false` => le test a échoué, sans raison particulière
* `“<erreur>”` => le test a échoué, pour la raison “erreur”
* `null` => test en attente

### Messages d'action

On peut afficher les opérations qui vont être exécutées grâce à la méthode `intest_action`. Cette action sera affichée à l’écran une seconde avant d’exécuter l’action proprement dite.

~~~javascript
'use strict'

INTests.define("Mon test d'action", async function(){
  
  await intests_action("Je vais cliquer sur le menu")
  menu.click()
  
  return true
})
~~~



## Les gels

Les gels sont des états des données de l’application.

Ils sont situés dans le dossier `js/INTests/gels`.

Chaque gel est un dossier :

* qui DOIT contenir le dossier `montrello` avec les données telles qu’elles doivent être.
* qui PEUT contenir un fichier `helpers.js` qui définit des méthodes utiles pour le dossier en question.
* qui PEUT contenir un fichier `expectations.js` qui définit les méthodes d’expectation propres au dossier en question.

Dans le programme lorsque le fichier `helpers.js` existe, les paramètres remontent `has_helpers: true`. Lorsque le fichier des expectations existe, les paramètres remontent `has_expectations: true`.

### Helpes de gels

Le fichier `helpers.js` à l’intérieur du dossier du gel peut définir des constants, des méthodes, etc.

Ce qu’il faut comprendre, c’est que ce fichier sera chargé avant les données elles-mêmes. Donc, par exemple, si on met dans le fichier :

~~~javascript
// dans dossier-gel/helpers.js

'use strict'

const MonDiv = DGet('div#mon-div') // <== N'EXISTE PAS ENCORE
~~~

Il faut donc utiliser la tournure suivant pour les propriétés :

~~~javascript
// dossier-gel/helpers.js
'use strict'

Object.defineProperties(window, {
  MonDiv:{
    get(){return DGet('div#mon-div')}
  }
})
~~~

