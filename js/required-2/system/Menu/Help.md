# Menu

Pour la création simple de menus 

Soit le chargement du fichier `_Menu.sass` ajouté au `main.sass` par :

~~~css
@import "systeme/Menu.sass"
~~~

Soit le fichier `Menu/Menu.js` chargé par :

~~~HTML
<script type="text/javascript" src="js/system/Menu/Menu.js"></script>
~~~

Si on pose dans la page :

~~~HTML

<menu data-class="MaClasse">[PICTO]
	<content>
		<li data-method="maMethode">Appeler ma méthode</li>
	</content>
</menu>

~~~

On appelle à l'initialisation

~~~javascript

Menu.init()

~~~

Et quand on passe sa souris sur le `[PICTO]` et que le menu déroulant s'ouvre et qu'on clique sur « Appeler ma méthode », alors la méthode `Menu_MaClasse#maMethode` est invoquée, définie dans :

~~~javascript

class Menu_MaClasse {
	static maMethode(){
		alert("Vous avez cliqué sur « Appeler ma méthode »")
	}
}

~~~