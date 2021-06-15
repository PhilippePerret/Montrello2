# Todo liste

* Poursuivre les encore-nouveaux tests que je vais peut-être appeler 'GestureTest'. Le principe est de glisser le chargement du test avant le chargement complet des données Montrello.
  
  - chaque test se trouve dans un dossier qui contient
    - l'état voulu de data/montrello (ou le gel à utiliser)
    - le script .js du test
  - les résultats s'affichent dans une autre fenêtre, ce qui permet de traiter les différents tests simplement en rechargeant la page

  - pour voir s'il y a un test à jouer, on appelle en ajax 
    au début de App.init()
    On appelle INTest (ajax/\_scripts/INTest/runner.rb)
    Tout le reste se trouve dans data/INTest
    Et notamment : data/INTest/config.yaml qui va définir s'il faut jouer des tests

  C'est géré dans App.init(). Pour le moment, si GEL_FOR_TEST est défini, on lance le test 
  Pour la suite :
    En fait, on fait des dossiers contenant :
      1) le gel à utiliser (c'est-à-dire l'état de départ)
      2) le script du test (en javascript, qui sera chargé)
  On doit utiliser une fonction qui va écrire sur la page, en visible (avec une opacité faible quand même) ce qu'on fait
  D'abord on présente le test ("Ce test va tester la création d'un nouveau tableau")
  Ensuite on donne la démarche. Cette démarche peut être la base du test :
    "Je clique sur le bouton tatata"
    "=> un menu s'ouvre avec tatata"
    "Je clique sur le sous-menu tatata"
    etc.

  - On pourra même imaginer un moyen de lancer les tests les un après les autres, simplement en conservant sur le disque (plutôt que dans le stockage local) l'état des tests. Par exemple avec le nom du dernier test joué.
    On définira une liste de tests : test1, test2, test3 (correspondant chacun à un dossier)
    L'application jouera le premier test
    Arrivée à la fin, elle se rechargera et chargera automatiquement le test suivant


* [BUG] À la création d'ue liste d'après un modèle, comme si toutes les tâches ne se créaient pas.
  Après la création de la duplication il faudrait la vérifier (vérifier si )
  Essayer avec la liste de fabrication d'un livre
* [BUG] Les cartes s'affichent n'importe où dans le dashboard
* [BUG] Quand on définit deux massets (dossier par exemple), le second ne s'enregistre pas
* [BUG] Quand on détruit un tableau, il faut mettre le premier en tableau courant
* [BUG] Le mini-éditeur doit être refermé s'il est ouvert quand l'objet édité est détruit
* [BUG] Quand on transforme une checklist en modèle, il faut opacifier son bouton modèle et faire apparaitre la cloche indiquant que c'est un modèle

MODÈLES 
  * Les associer à leur tableau (toujours)

TABLEAU DE BORD
  * on peut l'ouvrir par défaut au lancement de l'application
  * affiche sous forme de lumière l'état général
  * affiche (masqué) les préférences (configuration)

* Un type d'archive (voir si le nom est bon) qui serait des programmations dans le futur :
  - la carte/fiche s'archive, mais quand vient la date "du" définie, on la ressort pour l'afficher.
    Il faut l'accompagner d'un message, peut-être dans le tableau de bord
* "indicateur" (lumières rondes) récapilant l'état général du tableau. SI premier est tableau de bord, on les affiche toutes
  On pourrait mettre sous cet indicateur une minijauge (genre 32px max) qui indiquerait le niveau de développement.

* Contrôleurs
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
  * CB afficher le tableau de bord à l'ouverture (sinon dernier tableau)
  * Menu pour donner le nombre de jours pour considérer la date proche

## Tests à faire

* Tableaux
  * Quand on le détruit :
    * le premier est mis en courant s'il existe
    * un nouveau tableau est créé s'il en n'existe pas

* Test d'enfants classés
  * on classe une liste d'enfants
  * on ajoute un enfant
  * => il ne doit pas encore être dans la liste classée, mais il doit s'afficher au bon endroit

* Quand une liste est un modèle :
  - isModele de la checklist doit être true
  - son formulaire doit comporter une cloche à côté de son bouton 'modèle'
  - ce bouton doit être désactivé
