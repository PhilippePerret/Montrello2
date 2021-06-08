'use strict'

Object.assign(UI,{
	init(){
		Menu.init()
		// Tous les éléments textuels éditables doivent l'être
		this.setEditableIn(document)
	},

	/**
	 * Remplace le noeud +n+ par son propre clone, par exemple pour
	 * supprimer tous les écouteurs d'évènement
	 */
	clone(n){
		n.replaceWith(n.cloneNode(true))
	},

	/**
		* Méthode qui transforme tous les éléments de classe .editable
		*	en éléments dont on peut éditer le texte directement
		* 
		* ATTENTION : si des écoutes sont ajoutées, penser à les retirer
		* dans unsetEditableIn ci-dessous
		*/
	setEditableIn(container){
		// console.log("-> UI#setEditableIn, dans container :", container)
		container.querySelectorAll('.editable').forEach(element => {
			// On recherche le premier parent qui définit la classe
			// Note : la classe est "collée" à l'élément à la création de
			// l'élément. Par exemple, s'il s'agit d'une liste, l'instance
			// Liste est collée à la balise <liste> qui contient notamment
			// le titre éditable.
			let parent = element.parentNode
			while( parent && !parent.owner ) {
				parent = parent.parentNode
			}
			if (parent) element.owner = parent.owner;
			element.addEventListener('click', this.onEditEditable.bind(this, element))
		})

		/** Les balises définissant 'data-strict-class' (*)
			*
			*	SOIT Elles définissent aussi data-method (courte portée)
			* SOIT Elles contiennent des balises qui définissent data-method
			*				(longue portée)
			*
			* (*) mais seulement si elles possèdent un propriétaire. Par
			*			exemple, pour le formulaire de Carte, ce propriétaire
			*			n'est défini que lorsqu'un carte est éditée.
			*/
		let method, classe

		container.querySelectorAll('*[data-strict-class][data-method]')
		.forEach(element => {
			classe = eval(element.getAttribute('data-strict-class'))
			method = element.getAttribute('data-method')
			element.owner = container.owner
			// console.log("Observeur pour element ... classe ... méthode '%s'", method, element, classe)
			element.addEventListener('click', classe[method].bind(classe, element))
		})

		if ( container.owner ) {
			container.querySelectorAll('*[data-strict-class]')
			.forEach(element => {
				classe = eval(element.getAttribute('data-strict-class'))
				element.querySelectorAll('*[data-method]').forEach(tag => {
					tag.owner = container.owner
					method = tag.getAttribute('data-method')
					tag.addEventListener('click', classe[method].bind(classe, tag))
				})
			})
		}

		/**
		 * Autre manière de procéder (sans eval), avec un DOM Element
		 * de class 'methods-container', sur lequel on place un owner
		 * qui recevra toutes les méthodes. De cette manière, il suffit
		 * de définir le owner de ce DOM Element pour savoir à qui
		 * s'applique les méthodes
		 */
		container.querySelectorAll('.methods-container').forEach(cont => {
			if ( cont.owner ) {
				cont.querySelectorAll('*[data-method]').forEach(trigger => {
					const method = trigger.getAttribute('data-method')
					if ('function' == typeof cont.owner[method]){
						trigger.addEventListener('click', cont.owner[method].bind(cont.owner, trigger))
					} else {
						console.error("Erreur implémentation : la méthode '%s' est inconnu de", method, cont.owner)
					}
				})
			} else {
				// C'est normal si c'est un modèle (comme le modèle de carte)
				var p = cont
				var isModele = false
				while (p = p.parentNode){
					if (p.tagName == 'MODELES'){isModele = true; break;}
				}
				if (false == isModele){
					console.error("L'élément DOM suivant devrait définir son owner pour l'appliquer aux méthodes qu'il contient.", cont)
				}
			}
		})


		container.querySelectorAll('*[data-class]').forEach(container => {
			if (container.classList.contains('feedable')){ return }
			const classe = eval('Menu_' + container.getAttribute('data-class'))
			container.querySelectorAll('content > *[data-method]').forEach(el => {
				const method_name = el.getAttribute('data-method')
				// console.log("classe", classe)
				// console.log("methode name:", method_name)
				el.owner = container.owner
				el.addEventListener('click', classe[method_name].bind(classe, el))
			})
		})

		container.querySelectorAll('menu.feedable').forEach(menu => {
			FeedableMenu.build(menu)
		})

	},

	setOwnerMethodsIn(container, owner){
		container.querySelectorAll('button[data-owner-method]').forEach(btn =>{
			owner = owner || btn.owner
			// console.log("Bouton, owner", btn, owner)
			const method = btn.getAttribute('data-owner-method')
			btn.addEventListener('click', owner[method].bind(owner, btn))
		})
	},

	onEditEditable(element, ev){
		MiniEditor.edit(element, {x: ev.clientX, y: ev.clientY})
	}

})

class DraggableObject {
	constructor(obj){
		this.obj = obj
	}
	onClick(){
		this.obj.classList.add('moved')
	}
}