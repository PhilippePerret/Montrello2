# Manuel Scaffold

> Note : il s’agit du nouveau scaffold avec un serveur Rack/Puma



## Définir facilement des boutons et leur action

Dans le DOM :

~~~html
<div class="methods-container for-me">
  <!--
		La classe 'methods-container' indique que cet élément va contenir
		des boutons définissant 'data-method'

		La classe 'for-me' (ou n'importe quoi d'autre) permet de reconnaitre
		ce DOM Element en particulier
	-->
  <button data-method="maMethod">Appeler maMethod</button>
  <button data-method="autreMethod">Appeler autreMethod</button>
  <!-- etc. -->
</div>
~~~

Dans l’objet :

~~~javascript
class MonObjet {
  
  observe(){
    // this.obj est une référence au DOM élément de l'instance MonObjet
    // dans le DOM
    // On définit le propriétaire de ce div
    this.obj.querySelector('div.methods-container for-me').owner = this
    
    // On appelle la méthode UI qui va placer les écouteurs d'évènement
    // click
    UI.setEditableIn(this.obj)
  }


  maMethod(){
    console.log("J'ai été appelée par le bouton 'Appeler maMethod'")
  }
  
  autreMethod(){
    console.log("J'ai été appelée par le bouton 'Appeler autreMethod'")
  }

}
~~~

Un des grands avantages de cette méthod, outre le fait que ça simplifie le code, c’est qu’elle permet de voir tout de suite la méthode appelée par le bouton.