# Manuel des MiniTests (de l'intérieur)



> Note : c’est une version allégée des inside-tests (qui ne me plaisent pas encore)



## Mise en place des tests

* Implémenter **le fichier `./ajax/_scripts/MiniTest/before_suite.rb`** pour définir ce qu’il faut faire au début des tests (avant le premier.
* Implémenter **le fichier `./ajax/_scripts/MiniTest/after_suite.rb`** pour définir ce qu’il faut faire à la fin des tests (par exemple remettre la configuration du départ)
* Implémenter **le fichier `./ajax/_scripts/MiniTest/gel.rb`** pour définir comment produire les gels.
* Implémenter **le fichier `./ajax/_scripts/MiniTest/degel.rb`** pour définir comment dégeler les gels.
* Implémenter **tous les tests dans le dossier `./js/MiniTests/`**. Ce sont de simples fichiers javascript. cf.[leur implémentation](#implementation-tests).
* Implémenter le fichier définissant la [**liste des tests à jouer**](#liste-tests), dans `./js/MiniTests/_tests_list.js`.
* Implémenter la méthode **`App.init()`** qui doit initialiser l’application avant chaque test.



### Retour des tests

Les résultats des tests sont **retournés en console**, il faut donc ouvrir l’inspecteur javascript dans le navigateur.

**Cocher aussi la case « Conserver l’historique »** pour ne pas le perdre à chaque changement. En revanche, il est inutile de le vider après les tests, ce sera fait automatiquement au début de la suite de tests.


---

<a id="liste-tests"></a>

## Liste des tests à jouer

La liste des tests à jouer doit être définie dans le fichier `./js/MiniTests/_config.js` grâce au code :

~~~javascript
// _config.js
'use strict'

MiniTest.config = {
  ...
}

MiniTest.tests_list = [
		'<affixe premier test>'
	, '<affixe second test>'
  , ...
  , '<affixe dernier test>'
]
~~~

#### Filtre les « cases »

Pour choisir les tests à jouer dans un fichier test, il suffit d’utiliser les « blocs de commentaires intelligents » en javascript :

~~~javascript
/* [Il suffit d'ajouter un '/' pour décommenter le test — et donc le jouer]
MiniTest.add("mon test à commenter", async function(){
	// ....
})
// [la subtilité est ici] */

// Le même test décommenté :

//* [Il suffit d'ajouter un '/' pour décommenter le test — et donc le jouer]
MiniTest.add("mon test à commenter", async function(){
	// ....
})
//*/
~~~



---

<a id="expectations"></a>

## Expectations

Les “expectations” (attentes) ont toutes la forme :

~~~javascript
expect(<sujet>).<verbe>(<valeur>).else(<message d’erreur>)
~~~

Par exemple :

~~~javascript
expect(2 + 2).eq(4).else("2 + 2 devrait être égal à 4. Il vaut #actual.")
~~~

La valeur attendue et la valeur réelle, lorsqu'elles peuvent s'exprimer, peuvent être introduire dans les messages en utilisant respectivement `#expected` et `#actual`.

Toutes les méthodes d’expectation sont défines dans le fichier [js/required-2/system/MiniTests/Expectations.js](js/required-2/system/MiniTests/Expectations.js).

Pour une liste complète des méthodes d’expectation, ouvrir une fenêtre de Terminal au dossier de l’application et jouer :

~~~bash
> bin/minitest-expectations
~~~

#### Expectations propres à l'application

On peut définir des expectations propres à l’application dans un fichier qui portera le nom `Expectations.js` (\*) (par exemple dans le fichier `./js/MiniTests/extensions/Expectations.js`).

> (*) pour pouvoir relever les méthodes avec le binaire `bin/minitest-expectations`

Ce fichier devrait être chargé en l’ajoutant dans la liste `MiniTest.helpers_list` du fichier `_config.js`.

~~~javascript
'use strict'

Object.assign(Expectation.prototype, {
  
 /**
 	* doc/
 	* hasChild(child) / not_hasChild(child)
 	*
 	*	... pour la documentation des expectations
 	*
 	* /doc
 	*/
	hasChild(child){
    return new ACase(<ok>, <expected>, <actual>, <motif>, <message failure défaut>)
 	}
	not_hasChild(child){
	  //  ...
	}
})
~~~



---

<a id="construction-test"></a>

## Construction d'un test



Après avoir installé les prérequis, on peut construire le premier test.

On marque la base :

~~~javascript
MiniTest.add("Mon premier test", async function(){
  
  return true // pour le moment
})
~~~

Si on doit partir d'un gel, on l'indique.

~~~javascript
MiniTest.add("Mon premier test", async function(){

	degel('mon-gel-de-depart')
	
  return true // pour le moment
})
~~~



On peut écrire ensuite les choses à attendre de ce test à l’aide de la méthode `suivi` des `MiniTest` :


~~~javascript
MiniTest.add("Mon premier test", async function(){
  
  degel('mon-gel-de-depart')
  
  // TODO
  this.suivi("La balise div#mon-div existe")
  
  // TODO 
  this.suivi("La classe MaClasse doit répondre à maMethode")
  
  // TODO
  this.suivi("L'appelle de MaClasse#maMethode doit retourner le bon résultat")
  
  return true // pour le moment
})
~~~

On peut ensuite implémenter les méthodes de test.

~~~javascript
MiniTest.add("Mon premier test", async function(){
  
  degel('mon-gel-de-depart')
  
  expect(page).has("div#mon-div").else("La balise #expected devrait exister.")
  this.suivi("La balise div#mon-div existe")
  
  expect(MaClasse).respond_to('maMethode').else("La classe #sujet devrait répondre à la méthode #expected")
  this.suivi("La classe MaClasse doit répondre à maMethode")
  
  let retour 		= MaClasse.maMethod()
  let resultat 	= 12
  expect(retour).eq(resultat).else("MaClasse.maMethod devait retourne '#expected'. Elle retourne '#actual'.")
  this.suivi("L'appelle de MaClasse#maMethode doit retourner le bon résultat")
  
  return true // pour le moment
})
~~~





---

<a id="reinit"></a>

## Réinitialisation de l'application

Maintenant que l’application se charge à chaque test (*), il est inutile de resetter l’application.

> (*) sauf dans des cas particuliers où on veut faire un seul test, avec une configuration spéciale et que la propriété de configuration ‘reset_before_each_test’ est mise à false.



---

<a id="les-gels"></a>

## Les Gels

Pour utiliser des gels, on invoque les méthodes d’helpers `gel` et `degel`.

#### Utilisation d’un gel

~~~javascript
MiniTest.add("Mon test qui utilise un gel", async function(){
  
  await gel("mon-gel")
  
  // ... procéder ici au test à partir du gel ...
  
  return resultat
})
~~~



#### Production d’un gel

~~~javascript
MiniTest.add("Mon test pour créer un gel", async function(){
  
  // ... des opérations qui doivent créer un état ...
  
  await gel("nom du gel à partir de l'état courant", `Description
La description précise du gel.
L'état où l'on en est.
`)
  
  return ok
})
~~~



Pour fonctionner, il faut définir pour chaque application la méthode de gel et de dégel. Ce sont des fichiers à mettre dans `./ajax/_scripts/MiniTest/` avec les noms `gel.rb` et `degel.rb`.

~~~ruby
# gel.rb

gel_name = Ajax.param(:gel_name)
gel_desc = Ajax.param(:gel_description)

# ... opérations à faire pour produire le gel voulu ...

Ajax << {message: "Gel #{gel_name} produit avec succès."}
~~~

~~~ruby
# degel.rb

gel_name = Ajax.param(:gel_name)

# ... Opérations à faire pour dégeler le gel ...

Ajax << {message: "Gel #{gel_name} dégelé avec succès."}
~~~


---

<a id="les-tests"></a>

## Les Tests

<a id="implementation-tests"></a>

### Implémentation d'un test

La base de la définition d'un test est :

~~~javascript
'use strict'

MiniTest.add("<nom de mon test>", async function(){
  
  // ... opérations de test ...
  
  return resultat
})
~~~

On notera :

* la fonction asynchrone en seconde paramètre,
* le retour, toujours, d’un résultat. Ce résultat peut être [de différents types][#retours-test].

<a id="retours-test"></a>

### Retour des tests

Le retour des tests peut avoir des valeurs très différentes. Je les résume ici, et les illustre plus bas :

> Note : on parle ici des valeurs réelles, strictes (`null` n’est pas `false`)

* `true` pour un test réussi, qui affiche son nom (et son path si nécessaire), 
* `false` pour un test raté, qui affiche seulement son nom et son path,
* `null` pour un **test réussi**, quand c’est un message précis qui doit être renvoyé comme résultat.
* un string valeur ‘pending’ pour un test en attente (non encore implémenté),
* un `String` quelconque, différent de ‘pending’, pour un message d’erreur précis.



#### Exemple de motif précis d'erreur

~~~javascript
MiniTest.add("Mon test avec erreur précise", async function(){
  let motif_echec = null // en cas de succès
  
  // ... des opérations ...
  
  await waitFor(page.has.bind(page,'div#mon-div')).catch(ret=>{
    // On définit ici le motifi d'échec
    motif_echec = "Le div #mon-div est introuvable. Je dois renoncer."
  })
  
  // Pour interrompre tout de suite
  if ( motif_echec != null ) return motif_echec
  
  // Ou :
  
  if ( motif_echec == null ) {
    
    // ... pour poursuivre le test ...
    
  }
  
  return motif_echec // on le retourne
})
~~~

---

## Messages en cours de test

Dans tous les cas, pour afficher des messages provisoires ou non, on peut utiliser les méthodes de console habituelles :

~~~javascript
console.log(...)
console.error(...)
console.warn(...)
~~~

Mais ces messages “pollueront” un peu les retours de test.

On peut utiliser plus profitablement la méthode `log` qui permet de ne rien produire en mode “quiet” avec un `debug_level` à 0 (défini dans la [configuration](#configuration) des tests).

~~~javascript
log("Mon message sensible", 1)
// Ce message ne s'affichera que si les debug_level est supérieur ou
// égal à 1

log("Mon message insensible", 9)
// Ce message ne s'affichera que si le debug_level est supérieur ou
// égal à 9

log("Un message qui s'affichera toujours", -1)
~~~



---

<a id="configuration"></a>

## Configuration des tests

La configuration des tests est définie dans le fichier `./js/MiniTests/_config.js`

On trouve :

~~~javascript

MiniTest.config = {
	
	// Juste pour la virgule
	config: true
	
	// Pour définir le mode de débuggage. Tous les messages 
	// en dessous de cette valeur seront affichés.
	, debug_level: 0 
	
	// Pour réinitialiser l'application avant chaque test
	// cf. la section qui en parle
	, reset_before_each_test: true
  
  // Pour indiquer s'il faut ou non afficher les messages
  // de suivi
  , hide_suivi_messages: false
}

~~~

---

## Méthodes d'helpers

### Méthodes propres à l'application

Avant toute chose il convient de rappeler que puisque ces mini-tests se font à l’intérieur même de l’application, on peut utiliser toutes les méthodes de cette application (notamment pour faire des tests unitaires mais aussi pour créer des méthodes d’helpers propres). Ces méthodes peuvent même se trouver dans des modules du dossier `./js/MiniTests/` qui ne seront pas des tests. 

### Méthodes de test de la page

#### page.has(`selector`[, `<attributs>`])

Retourne `true` si la page contient le sélecteur et ses attributs.

`<attributs>` peut définir aussi `in` pour chercher dans un container particulier et `count` pour trouver exactement le nombre d’éléments voulus.

#### page.contains(`<message>`)

Retourne `true` si la page contient le message.



### Méthodes d’interaction avec la page

#### page.click(`<selector>`[, `<params>`])

Pour cliquer sur l’élément spécifié.

Par exemple : 

~~~javascript
MiniTest.add("mon test du click", async function(){
  
  page.click('button#mon-bouton', {in: "div#mon-div"})
  
})
~~~

---

<a id="annexe"></a>

## Annexe

<a id="gestion-reset"></a>

### Gestion du reset

Comme nous l'avons expliqué, pour réinitialiser l'application avant chaque test, on recharge la page (est-ce vraiment suffisant, d'ailleurs ?…). Le fonctionnement est le suivant :

Nouveau fonctionnement plus simple :

~~~

On prend le premier fichier de la liste tests_list (sans le sortir de la
liste).

On le charge, ce qui définit tous ses cas.

Si store.last_case_index est non défini, on le met à -1
				Note : 'store' est un objet qui permet de simplifier le travail
							 avec localStorage.

On met MiniTest.case_index à 0.

Si le cas last_case_index + 1 existe, on le joue et on incrémente
last_case_index pour prendre le prochain test au prochain chargement.
				Note : on ne le décrémente qu'à la fin, ce qui permet de
				gérer les dégels plus facilement.

Au prochain chargement, on recharge le même fichier.
S'il reste des cas, on les joue.
S'il ne reste pas de cas, on passe au fichier suivant.
S'il ne reste plus de fichier, on arrête les tests et on affiche le
rapport.


~~~

Pour le moment, pour obtenir tous les messages, il faut “conserver l’historique” dans la console. À l’avenir, on pourra imaginer mémoriser le suivi et le ressortir à chaque fois (ou seulement à la fin ?)

#### Pour mémoriser toutes les lignes

SI les tests sont longs, mémoriser toutes les lignes dans une seule donnée peut être très consommateur. Pour ne pas faire comme ça, on enregistre chaque ligne dans une donnée différente :

* un compteur ‘last_id_console_line’ mémorise le dernier numéro de ligne utilisé
* lorsqu’on doit enregistrer une ligne, on incrémente `last_id_console_line` et on met la ligne dans la donnée `console_line_<last_id_console_line>`.

On utilise pour ce faire la méthode `store.addConsoleLine(<line>)`.

#### Pour écrire toutes les lignes

C’est la méthode `store.writeConsoleLines()` qui est invoquée, en fin de tests.