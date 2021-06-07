# Montrello<br/>Manuel développeur



### Obtenir un objet quelconque

~~~javascript
// Par type et identifiant :

const obj = Montrello(<type>,<id>)

// ou par référence :

const obj = Montrello("<type>-<id>")
~~~



Par exemple, pour obtenir la liste d’identifiant 12 :

~~~javascript
const l12 = Montrello.get('li', 12)

// ou

const l12 = Montrello.get('li-12')
~~~



Si on connait la classe de l’élément, on peut bien sûr l’obtenir par :

~~~javascript
const l12 = Liste.get(12)
~~~

---

<a div="modele-element"></a>

### Modèle d'éléments

Chaque type d'élément (tableau, liste, carte, etc.) possède un modèle dans le dossier `./html/`. Comme les éléments sont des objets semblables (héritant tous de `MontrelloObjet`) ils doivent posséder des éléments communs :

* Un **bouton pour détruire l’élément**. Il doit posséder la classe **‘btn-self-remove’.** La méthode `observe` de la classe abstrait `Montrello` renseigne automatiquement ce bouton à la création de l’élément.
* Une balise `<children>` pour placer les enfants, quel que soit leur type.
* Un **bouton pour ajouter un enfant à l’élément**. Il possède la classe **`btn-add-child`**. La méthode `MontrelloObjet#observe` place automatiquement un écoute d’évènement clic sur cet élément.

---

<a div="ownership-element"></a>

## Appartenance des éléments

Les principes d’appartenance appliqués sont :

* seul l’enfant possède à la référence à son parent (i.e. le parent n’enregistre jamais de liste de ses enfants), 
* c’est au chargement que les parents sont renseignés,
* on respecte la hiérarchie : TABLEAU > LISTE > CARTE > CHECKLIST > TÂCHE > MASSET



Les méthodes utiles sont :

~~~javascript
<parent>.children 
// => retourne a liste Array des enfants

<parent>.forEachChild(<function>)
// Tourne la fonction <function> sur chaque enfant
// Cette fonction doit recevoir en dernier argument l'enfant

<enfant>.parent
// => retourne l'instance du Parent

<parent>.addChild(<enfant>)
// Ajoute l'enfant <enfant> à la liste des enfants du parent
~~~



#### Consignation du parent

Le parent est consigné dans la propriété `ow` de l’enfant. Sa valeur est une référence (`ref`) à l’objet (donc `<type réduit>-<id>`).

> La propriété `ow` vient de `owner` propriétaire.
