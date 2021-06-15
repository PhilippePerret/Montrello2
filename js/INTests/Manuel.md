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

