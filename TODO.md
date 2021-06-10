# Todo liste


* DESTRUCTION
  * Il semble que certains objets ne sont pas détruits (peut-être ne sont-ils pas enregistrés dans leur parent. Oui, c'est le cas des checklists dans les cartes.

* Gérer les modèles
  - création d'un modèle à partir d'un élément
  - adaptation d'un élément à un modèle (une checklist, une carte)
  - peut-être que le modèle est toujours lié, ou alors une option pour le déterminer
    Si le modèle est toujours lié, on l'actualise à chaque fois

* Gérer les tâches/carte en cours, les mettre dans une partie dédiée dans le tableau de bord
  -> C'est une règle automatique placée sur l'étique rouge
  * Étudier la possibilité de faire DES RÈGLES (mais ça me semble un peu compliqué, si je me réfère à Trello…)

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

## Tests à faire

* Test d'enfants classés
  * on classe une liste d'enfants
  * on ajoute un enfant
  * => il ne doit pas encore être dans la liste classée, mais il doit s'afficher au bon endroit