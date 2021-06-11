# Todo liste

* Gérer les modèles
  * La duplication des checklists se passe presque bien sauf que :
    1. la checklist n'apparait pas dans le formulaire d'édition de la carte
    2. le premier élément est supprimé… (mystérieusement)
  * Mettre un signe sur l'objet qui est un modèle
  * Au chargement des modèles, indiquer au référent qu'il est un modèle (isModele = true)
  * Remplacer "modèles" par "template" soit pour parler de ces modèles, soit pour parler
    des modèles de carte, etc. dans la balise <modeles>

* Checklist
  * [BUG] Encore un bug à la première création. Le formulaire pour demander le nom de la première tâche s'écrit n'importe où (l'ul de la liste doit se créer dans la carte, il faudrait tout de suite le déplacer dans le formulaire — ou le déplacer dans le formulaire directement puisque c'est uniquement là qu'on le lit et l'édite)

* Gérer les tâches/carte en cours, les mettre dans une partie dédiée dans le tableau de bord
  -> C'est une règle automatique placée sur l'étique rouge
  * Étudier la possibilité de faire DES RÈGLES (mais ça me semble un peu compliqué, si je me réfère à Trello…)

* OBJETS
  * possibilité de verrouiller un objet, c'est-à-dire impossibilité de le modifier ou de le supprimer

* Étiquettes (tags)
  - Il faut supprimer la case à cocher qui apparait maintenant
  
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