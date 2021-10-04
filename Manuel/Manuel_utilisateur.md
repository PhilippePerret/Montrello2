# Montrello<br>Manuel utilisateur



## Les cartes

Ce sont les éléments les plus importants de l'application.

Une des grandes forces de Montrello (par rapport à Trello) est de pouvoir [associer un fichier](#associate-file-to-cart), [associer un dossier](#associate-folder-to-cart), [associer une URL](#associate-url-to-cart) ou [associer une commande](#associate-command-to-cart) à une carte, pour avoir un accès complet à toutes les fonctionnalités de l'ordinateur.

<a id="associate-file-to-cart"></a>

### Associer un fichier à une carte

Associer un fichier à une carte permet de l'ouvrir en cliquant simplement sur un bouton "Open".

#### Associer le fichier

* mettre la carte en édition en cliquant dessus
* cliquer sur le bouton « Pièce jointe » (avec un trombone)
* copier-coller le chemin d'accès complet au fichier (ou glisser le fichier dans le champ)
* cliquer "OK"

#### Ouvrir le fichier associé

* mettre la carte en édition
* cliquer sur le bouton « Open » en regard du fichier.

#### Dissocier le fichier

* mettre la carte en édition
* repérer le fichier joint
* cliquer sur le croix rouge en regard de son chemin d'accès.

<a id="associate-folder-to-cart"></a>

### Associer un dossier à une carte

#### Associer le dossier

* mettre la carte en édition en cliquant dessus
* cliquer sur le bouton « Dossier » (avec une icône de boite en carton)
* copier-coller le chemin d'accès complet au dossier (ou glisser le dossier dans le champ)
* cliquer "OK"

#### Ouvrir le dossier associé (dans le Finder)

* mettre la carte en édition
* cliquer sur le bouton « Open » en regard du dossier.
* => Le dossier s'ouvre dans le Finder

#### Dissocier le dossier

* mettre la carte en édition
* repérer le dossier
* cliquer sur le croix rouge en regard de son chemin d'accès.

<a id="associate-url-to-cart"></a>

### Associer une URL à une carte

#### Associer l'URL

* mettre la carte en édition en cliquant dessus
* cliquer sur le bouton « URL » (avec une icône en forme de Terre)
* écrire l'URL voulue
* cliquer "OK"

#### Ouvrir l'URL associée dans le navigateur

* mettre la carte en édition
* cliquer sur le bouton « Open » en regard de l'URL.
* => L'URL s'ouvre dans le navigateur par défaut

#### Dissocier l'URL

* mettre la carte en édition
* repérer l'URL
* cliquer sur le croix rouge en regard de sa valeur.

<a id="associate-command-to-cart"></a>

### Associer une commande à une carte

On peut associer du code bash ou le chemin d'accès à un fichier de commande quelconque (dans son programme de choix) qui sera exécuté lorsque le bouton correspondant sera activé dans la carte. Cela offre donc toutes les perspectives possibles jusqu'au plus compliquées et complètes.

---

<a id="annexe"></a>

## Annexe

<a id="backups-officiels"></a>

### Backups officiels des données

#### Produire un backup officiel des données

Pour produire un backup officiel des données, c'est-à-dire une copie de dossier `data/montrello`, il suffit de jouer `backup` dans la console.

#### Revenir à un backup officiel des données

Pour revenir au dernier backup officiel, on doit jouer :

```
debackup
```

… en console.