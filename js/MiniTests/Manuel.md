# Manuel mini-test pour Montrello

> Note : le manuel général de MiniTest se trouve dans le fichier [./js/required-2/system/MiniTests/Manuel.md](/Users/philippeperret/Programmes/Montrello/js/required-2/system/MiniTests/Manuel.md). On peut l’ouvrir simplement en ouvrant une fenêtre Terminal au dossier de l’application et en jouant :
>
> ~~~bash
> > bin/minitest-manuel
> 
> # Ajouter -d pour la version modifiable
> 
> > bin/minitest-manuel -d
> ~~~



## Obtenir une données montrello (objet)

Dans les tests, il est très simple d’obtenir une donnée enregistrée dans un fichier YAML du dossier data :

~~~javascript
MiniTest.add("Ma récupération de données", async function(){
  
  ...
  
  let data = (await Ajax.send('load.rb', {type:'<le type>', id: <identifiant>}))

  // Ou la méthode d'helper

  let data = (await TData.get('<le type>', <identifiant>))
  ...

  return data != null
})
~~~

