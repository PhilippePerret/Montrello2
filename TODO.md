# Todo liste

* [BUG] La jauge du formulaire de carte doit se régler à l'ouverture/construction
* [BUG] Le mini-éditeur doit être refermé s'il est ouvert quand l'objet édité est détruit

* Dans la liste des modèles, indiquer la référence (trouvable) au modèle d'origine, pour pouvoir le modifier. Le mettre dans le title, comme ça il pourra être long

* "indicateur" (lumières rondes) récapilant l'état général du tableau. SI premier est tableau de bord, on les affiche toutes
  On pourrait mettre sous cet indicateur une minijauge (genre 32px max) qui indiquerait le niveau de développement.

* Contrôleurs
  - contrôleur de cartes courantes (est-ce que ce n'est pas une règle plutôt ?)
  - contrôleur d'indicateur (lumières d'état StateLight)
  - contrôleur de boutons de carte (ce sont les boutons qui permettent de modéliser, d'archiver, de détruire etc. les cartes, dans le formulaire d'édition de la carte). Il faut pouvoir les "détacher" pour les utiliser sans ouvrir la carte, dans un menu qui apparaitra en cliquant sur un bouton "..." en haut à droite de la carte.
  - contrôleur de boutons de liste (idem que pour carte), le bouton en haut à droite qui gèrera les listes. Il s'ouvrira avec un bouton "...". Comme pour la carte, il remplacera le bouton "x" de destruction (qui pour le moment a trop d'importance.
    => les trois contrôleurs de tableau, de carte et de liste doivent être une même classe de contrôleur qui fonctionneront de la même manière, à partir d'un bouton "..." et d'un propriétaire.

* Gérer les modèles
  * La duplication des checklists se passe presque bien sauf que :
    1. la checklist n'apparait pas dans le formulaire d'édition de la carte
        Je ne sais pas si c'est ça, mais de toutes façons, il faut construire les tasks
    2. le premier élément est supprimé… (mystérieusement)
  * Mettre un signe sur l'objet qui est un modèle
  * Au chargement des modèles, indiquer au référent qu'il est un modèle (isModele = true)
  * Remplacer "modèles" par "template" soit pour parler de ces modèles, soit pour parler
    des modèles de carte, etc. dans la balise <modeles>

* Gérer les tâches/carte en cours, les mettre dans une partie dédiée dans le tableau de bord
  -> C'est une règle automatique placée sur l'étiquette rouge
  * Étudier la possibilité de faire DES RÈGLES (mais ça me semble un peu compliqué, si je me réfère à Trello…)

* OBJETS
  * possibilité de verrouiller un objet, c'est-à-dire impossibilité de le modifier ou de le supprimer
    => Le mettre dans la liste des ses outils (contrôleur d'outils d'objet)

  
* CARTES
  * Possibilité de cocher la date pour indiquer que la tâche est finie
  * Méthode 'displayUpdate' pour la carte. Appelée :
    * quand on ajoute/modifie/supprime la date dans la carte, actualiser son affichage
  * S'il n'y a aucune donnée dans une nouvelle carte, mais qu'il y a une description, c'est cette description qu'on écrit.

* Gérer cette Todo liste dans l'application elle-même (tableau "Programmes" avec Montrello)

* Changer chaque fois de couleur de fond
  * Une donnée couleur doit être complexe, c'est un jeu de couleur + possibilité d'une image de fond

* PRÉFÉRENCES
  * CB changer de fond à chaque utilisation
  * CB Détruire automatiquement les objets orphelin (sinon, donner l'alerte comme c'est le cas maintenant)
  * CB Le première tableau est un tableau de bord

## Tests à faire

* Test d'enfants classés
  * on classe une liste d'enfants
  * on ajoute un enfant
  * => il ne doit pas encore être dans la liste classée, mais il doit s'afficher au bon endroit

* Quand une liste est un modèle :
  - isModele de la checklist doit être true
  - son formulaire doit comporter une cloche à côté de son bouton 'modèle'
  - ce bouton doit être désactivé
