# Todo liste

* gérer l'ordre 
  * méthode MontrelloObjet#onChangeChildrenOrder
  * propriété childrenOrder <-> data.co
  * méthode getChildrenOrder qui relève dans l'obj de l'objet l'ordre des éléments dans la balise <children>.

* Pour la destruction, "rassembler" d'abord tous les objets à détruire et faire un seul appel Ajax pour détruire tous les objets d'un coup (faire un backup lorsqu'il y en a un certain nombre)

* Reprendre complètement l'édition d'une carte par le formulaire de carte, en l'isolant complètement, c'est-à-dire sans le faire hériter des méthodes TOMiniMethods.
  * Il faut que ce soit une "pipe" complet vers la carte éditée. C'est-à-dire que lorsqu'on modifie une valeur, elle est modifiée a) dans le formulaire de carte et b) dans la carte elle-même si c'est une valeur affichée.

* Enregistrer l'ordre des enfants (mais ne le faire que lorsque la liste a été modifiée une première fois)
  * en tenir compte lorsque l'on construit le parent
  * étudier la possibilité de tout charger puis ensuite tout construire dans un second temps, avec toutes les données, pour pouvoir ordonner tout de suite les enfants.

* Gérer les suppressions de n'importe quel élément
  * Voir les suppressions qui doivent avoir une répercussion sur l'affichage (par exemple les jauges de développement)

* Gérer les modèles
  - création d'un modèle à partir d'un élément
  - adaptation d'un élément à un modèle (une checklist, une carte)
  - peut-être que le modèle est toujours lié, ou alors une option pour le déterminer
    Si le modèle est toujours lié, on l'actualise à chaque fois

* Gérer les tâches/carte en cours, les mettre dans une partie dédiée dans le tableau de bord

* CARTES
  * Possibilité de cocher la date pour indiquer que la tâche est finie
  * Régler la couleur de la date en fonction de la date courante (à l'approche, dépassée, achevée, etc.)
  * Méthode 'displayUpdate' pour la carte. Appelée :
    * quand on ajoute/modifie/supprime la date dans la carte, actualiser son affichage
    * quand on modifie la liste des tâches
  * S'il n'y a aucune donnée dans une nouvelle carte, mais qu'il y a une description, c'est cette description qu'on écrit.
  * Les dates doivent apparaitre sur la carte éditée

* Gérer cette Todo liste dans l'application elle-même (tableau "Programmes" avec Montrello)

* Changer chaque fois de couleur de fond
  * Une donnée couleur doit être complexe, c'est un jeu de couleur + possibilité d'une image de fond