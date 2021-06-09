# Todo liste

* [BUG] Il y a encore plein de bugs dans la gestion de la liste des tableaux (et des MenuFeedable en général ?)

* Ré-implémenter l'enregistrement du classement des enfants, mais le faire dans MontrelloObjet puisque n'importe quel élément peut classer ses enfants (à part les tâches)
  * Traiter l'ordre des enfants
  * méthode MontrelloObjet#onChangeChildrenOrder
  * propriété childrenOrder <-> data.co
  * méthode getChildrenOrder qui relève dans l'obj de l'objet l'ordre des éléments dans la balise <children>.

* Pour la destruction, "rassembler" d'abord tous les objets à détruire et faire un seul appel Ajax pour détruire tous les objets d'un coup (faire un backup lorsqu'il y en a un certain nombre)

* Gérer les modèles
  - création d'un modèle à partir d'un élément
  - adaptation d'un élément à un modèle (une checklist, une carte)
  - peut-être que le modèle est toujours lié, ou alors une option pour le déterminer
    Si le modèle est toujours lié, on l'actualise à chaque fois

* Gérer les tâches/carte en cours, les mettre dans une partie dédiée dans le tableau de bord
  -> C'est une règle automatique placée sur l'étique rouge
  * Étudier la possibilité de faire des règles (mais ça me semble un peu compliqué…)

* CARTES
  * Possibilité de cocher la date pour indiquer que la tâche est finie
  * Méthode 'displayUpdate' pour la carte. Appelée :
    * quand on ajoute/modifie/supprime la date dans la carte, actualiser son affichage
  * S'il n'y a aucune donnée dans une nouvelle carte, mais qu'il y a une description, c'est cette description qu'on écrit.

* Gérer cette Todo liste dans l'application elle-même (tableau "Programmes" avec Montrello)

* Changer chaque fois de couleur de fond
  * Une donnée couleur doit être complexe, c'est un jeu de couleur + possibilité d'une image de fond

* Implémenter les préférences
  * CB changer de fond à chaque utilisation