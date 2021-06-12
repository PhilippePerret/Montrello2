'use strict'
/*
	Les objects qui utilisent les FeedableMenu doivent définir les 
	méthodes :

		static onChooseItem(<instance object>)

				Pour agir quand on choisit un élément de la liste
		
		static saveOrder([<orderedIds>])

				Pour enregistrer le nouvel ordre des éléments

		Par défaut, le span construit se fait juste avec le titre de 
		l'élément de référence. Si on a besoin d'un span personnalisé
		on peut utiliser la méthode d'instance :

		spanForFeedableMenu(<menu feedable>)

*/
class FeedableMenu {

static get(menu_id){
	if ( this.items ) {
		if ( this.items[menu_id] ) {
			return this.items[menu_id]
		} else {
			return systemError("Le menu #"+menu_id+" est inconnu des FeedableMenu…")
		}
	} else {
		return systemError("Les items de FeedableMenu ne sont pas définis. Impossible de retourner le menu #"+menu_id+".")
	}
}

static build(element){
	// console.log("Construction du menu de ", element)
	const m = new FeedableMenu(element)
	m.prepare()
	if (!this.items)this.items = {}
	Object.assign(this.items, {[element.id]: m})
}

/**
	* +element+ 	Span principal devant tout contenir
	*/
constructor(element){
	this.element 	= element
	this.owner 		= element.owner || raise("Il faut absolument un propriétaire de menu")
}

// Ouvre et ferme le menu
toggle(){
	this.element.classList.toggle('closed')
	this.element.classList.toggle('opened')
	this.isOpened = this.element.classList.contains('opened')
	if ( this.isOpened ) {
		// À l'ouverture, on s'assure que la position soit la bonne et
		// que la liste des éléments soit à jour. Sinon, on replace la
		// fenêtre et on actualise la liste
		this.ensureItems()
		this.ensurePosition()
	}
}

/**
 * S'assure, à l'ouverture du menu, que le nombre d'items soit
 * le bon
 * 
 */
ensureItems(){
	if (this.ul.children.length == this.owner.count) return
	console.log("Le nombre d'items a changé => Il faut actualiser la liste")
	this.update(this.owner.orderedIds)
}

/**
	* S'assure, à l'ouverture que le menu soit bien placé
	*/
ensurePosition(){
	const o = this.content
	const r = o.getBoundingClientRect()
	const p = this.element.getBoundingClientRect()
	// Si, par exemple, p.x est à 100, le content doit être mis à -200
	// Mais il sera placé alors à -10
	// Comme le content se place par rapport à l'élément, il faut mettre
	// son left à :
	// 	- p.x + 10 => 10 - p.x
	if ( r.top < 10 ){ 
		o.style.top = px(10 - p.y)
	}
	else if ( r.bottom > Window.bottom ) o.style.bottom = px(Window.bottom - p.y)
	if ( r.left < 10) o.style.left = px(10 - p.x)
	else if ( r.right > Window.right) o.style.right = px(Window.bottom - p.x)
}

/**
	* Ajoute un item
	* (par exemple un titre à une liste de titres)
	*/
add(item){
	this.ul || this.prepare()
	this.ul.appendChild((new FeedableMenuItem(this, item)).obj)
	this.onChangeOrder()
}

/**
 * Supprime un item
 * 
 */
remove(item){
	this.ul || this.prepare()
	const liItem = this.ul.querySelector(`li[data-id="${item.id}"]`)
	if ( liItem ) {
		liItem.remove()
		this.onChangeOrder()
	} else {
		console.log("Bizarrement, l'élément suivant n'a pas été trouvé dans le menu", item)
	}
}

prepare(orderedIds){
	this.buildMenuUL()
	this.peuple(orderedIds)
}

buildMenuUL(){
	this.ul = DCreate('UL', {class:'feeded-menu', style:'z-index:2000;'})
	this.element.classList.add('closed')
	this.content.insertBefore(this.ul, this.btnNouveau)
	this.element.addEventListener('click', this.toggle.bind(this))
}

update(orderedIds){
	if ( this.ul ) {
		this.ul.innerHTML = ""
		this.peuple(orderedIds)
	} else {
		this.prepare(orderedIds)
	}
}

peuple(orderedIds){
	var items = [] ;
	if ( orderedIds && orderedIds.length ) {
		orderedIds.forEach(id => items.push(this.owner.get(id)))
	} else if (this.owner.items) {
		items = Object.values(this.owner.items)
	}
	items.forEach(item => {
		const menuItem = new FeedableMenuItem(this, item)
		this.ul.appendChild(menuItem.obj)
	})
	this.setBoutonsUpAndDown()
}

/**
 * Méthode pour régler les boutons Up et Down
 * 
 */
setBoutonsUpAndDown(){
	const children = this.ul.children
	let btnU, btnD
	for (var i = 0, len = children.length; i < len; ++ i) {
		btnU = children.item(i).querySelector('.boutons .btn-up')
		btnD = children.item(i).querySelector('.boutons .btn-down')
		if ( i == 0 ) {
			btnU.classList.add('invisible')
			btnD.classList.remove('invisible')
		} else if ( i == len - 1 ) {
			btnU.classList.remove('invisible')
			btnD.classList.add('invisible')
		} else {
			btnD.classList.remove('invisible')
			btnU.classList.remove('invisible')
		}
	}
}

/**
 * Méthode appelée quand on change l'ordre des éléments du menu
 * 
 * Attention : cette méthode peut être appelée :
 * 	- depuis un item quand on le déplace
 * 	- depuis la méthode 'add' qui ajoute un item
 * 	- depuis la méthode 'remove' qui retire un item
 */
onChangeOrder(){
	if ( this.timerSave ) {
		clearTimeout(this.timerSave)
		delete this.timerSave
		console.log("this.timerSave", this.timerSave)
	}
	this.timerSave = setTimeout(this.saveOrder.bind(this), 3000)
	this.setBoutonsUpAndDown()
}
saveOrder(){
	// console.log("-> saveOrder")
	clearTimeout(this.timerSave)
	delete this.timerSave
	var orderedIds = []
	Array.from(this.ul.children).forEach(li => {
		orderedIds.push(parseInt(li.getAttribute('data-id'),10))
	})
	this.owner.saveOrder(orderedIds)
	message("J'ai enregistré le nouvel ordre.")
}

get content(){return this._content || (this._content = DGet('content',this.element))}

get btnNouveau(){
	return this._btnnew || (this._btnnew = DGet('button.btn-add', this.content))
}

}//class FeedableMenu

class FeedableMenuItem {
constructor(menu, item){
	this.menu 	= menu
	this.owner 	= item // L'instance de l'élément, par exemple un tableau
}

get obj(){return this._obj || (this._obj = this.build() )}

build(){
	const o = DCreate('LI', {class:`${this.owner.ref}-name`, 'data-id':this.owner.id})
	o.setAttribute('data-owner-ref', this.owner.ref)
	o.addEventListener('click', this.onClick.bind(this))

	// Si une méthode existe pour construire le span contenant le titre
	// on l'utilise, sinon, on en fait un tout simple
	let text ;
	console.log("this.owner", this.owner)
	if ( this.owner.spanForFeedableMenu ) {
		text = this.owner.spanForFeedableMenu(this.menu)
	} else {
		text = DCreate('SPAN', {text: this.owner.titre})
		if ( this.owner.data.ow ) {
			var referent = Montrello.get(this.owner.data.ow)
			console.log("referent (this.referent instanceof CheckList)", referent, referent instanceof CheckList)
			var referent_ref = `${referent.titre}`
			if ( referent instanceof CheckList ) {
				referent_ref += ` de la carte “${referent.parent.titre}” de la liste “${referent.parent.parent.titre}”`
			}
			text.setAttribute('title', `Originale ${this.owner.data.ow} ${referent_ref}`)
		}

	}

	// On ajoute au bout des flèches pour monter et descendre l'élément
	const boutons = DCreate('DIV',{class:'boutons'})
	const btnUp = DCreate('SPAN', {class:'btn-up', text:'↑'})
	const btnDown = DCreate('SPAN', {class:'btn-down', text:'↓'})
	btnUp.addEventListener('click', this.onClickBtnUp.bind(this))
	btnDown.addEventListener('click', this.onClickBtnDown.bind(this))
	boutons.appendChild(btnUp)
	boutons.appendChild(btnDown)
	o.appendChild(boutons)
	o.appendChild(text)
	this._obj = o

	return o
}

onClickBtnUp(ev){
	if ( this.obj.previousSibling ) {
		this.obj.parentNode.insertBefore(this.obj, this.obj.previousSibling)
		this.menu.onChangeOrder()
	} else {
		message("L'élément est le plus haut…")
	}
	return stopEvent(ev)
}
onClickBtnDown(ev){
	if ( this.obj.nextSibling) {
		this.obj.parentNode.insertBefore(this.obj, this.obj.nextSibling.nextSibling)
		this.menu.onChangeOrder()
	} else {
		message("L'élément est le plus bas…")
	}
	return stopEvent(ev)
}

onClick(ev){
	// console.log("Je dois activer = ", this.owner, this.menu.owner)
	this.menu.owner.onChooseItem(this.owner)
}

}// class FeedableMenuItem