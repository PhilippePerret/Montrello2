# Todo liste

* Généraliser le fonctionnement de l'appartenance : plutôt que d'avoir des listes d'objets, définir le parent. Par exemple, les listes ont un owner ('ow') qui correspond au tableau auquel elles appartiennent. En revanche, les tableaux n'enregistrent pas de liste de liste.
  * Le truc est à faire sur les cartes (qui appartiennent aux listes)
  * le truc est à faire sur ?
* Pour les mini-tests, plutôt que de conserver l'historique, mémoriser les tests passés (avec leur couleur) et les remettre à chaque fois — mais attention, ça supprime tout message console.log, console.warn etc. qui serait ajouté pour mieux voir ce qui se passe.
* Ajouter des dossiers ignorés, concernant les données data/montrello (venant des tests et backups)
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
  * Une donnée couleur doit être complexe, c'est un jeu de couleur + une image de fond