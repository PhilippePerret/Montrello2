'use strict'

Object.assign(UI,{
	init(){
		Menu.init()

		// Tous les éléments textuels éditables doivent l'être
		this.setEditableIn(document)
	},


	/**
		* Méthode qui transforme tous les éléments de classe .editable
		*	en éléments dont on peut éditer le texte directement
		*/
	setEditableIn(container){
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