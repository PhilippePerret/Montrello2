'use strict'

class MiniEditor {

	/**
	 * Méthode principale appelée par un objet possédant la classe 
	 * 'editable'
	 * 
	 * C'est la méthode UI.onEditEditable qui appelle cette méthode
	 * 
	 */
	static edit(element, pos, ev){
		// console.log("-> edit(element, pos, ev)", element, pos, ev, new Error().stack)
		this.miniEditor || this.buildMiniEditor()
		this.miniEditor.edit(element, ev)
	}

	static buildMiniEditor(){
		this.miniEditor = new MiniEditor()
		this.miniEditor.build()
	}

/**
 * Méthode appelée quand on clique sur un élément éditable, pour
 * éditer son texte.
 */
edit(element, ev){
	this.element = element
	this.owner   = element.owner
	if (this.owner) {
		this.forSpan = element.tagName != 'DIV'
		this.prepare({text: element.innerHTML})	
		this.show()
	} else {
		console.error("[MiniEditor] element = ", element)
		raise("Le propriétaire de l'élément (cf. console) est indéfini. Impossible de l'éditer.")
	}
	return ev && stopEvent(ev)
}

prepare(params){
	this.textField 	= this.obj.querySelector(this.forSpan ? 'input[type="text"]' : 'textarea')
	this.otherField = this.obj.querySelector(this.forSpan ? 'textarea' : 'input[type="text"]')
	this.textField.classList.remove('hidden')
	this.otherField.classList.add('hidden')
	this.value = params.text
	this.positionne()
}


positionne(){
	let newLeft, newTop ;
	let rectE = this.element.getBoundingClientRect()
	if ( this.forSpan ) {
		newTop 	= rectE.top
		newLeft = parseInt(rectE.left,10) - 15
	} else {
		/**
		 * Quand c'est un DIV (le mini-éditeur est alors un textarea), on
		 * remplace ce div par le miniéditeur qu'on ne met pas en posi-
		 * tion absolue mais relative
		 */
		newTop  = rectE.top - 40
		newLeft = rectE.left
	}
	if ( newLeft < 20 ) newLeft = 20
	if ( newTop < 20 ) newTop = 20
	this.obj.style.top 	= px(newTop)
	this.obj.style.left = px(newLeft)
}

show(){
	this.obj.classList.remove('hidden')
	this.textField.focus()
	this.textField.select()
}
hide(){
	this.obj.classList.add('hidden')
	document.body.appendChild(this.obj)
}


onKeyPressed(ev){
	if(ev.key == 'Enter') this.onClickSave(ev)
	else if (ev.key == 'Escape') this.onClickCancel(ev)
	return true
}
onKeyPressedTA(ev){
	if(ev.key == 'Enter' && ev.metaKey) this.onClickSave(ev)
	else if (ev.key == 'Escape') this.onClickCancel(ev)
	return true
}
onKeyDown(ev){
	if (ev.key == 'Tab') this.onClickCancel(ev)
	return true
}

onClickSave(ev){
	this.owner.set({[this.element.getAttribute('data-prop')]: this.value})
	this.stopEdition()
}
onClickCancel(ev){
	this.stopEdition()
}


stopEdition(){
	this.hide()
}

get value(){
	return this.textField.value
}
set value(v){
	this.textField.value = v
}

build(){
	let o = document.createElement('MINIEDITOR')
	o.class = 'hidden'

	let i = DCreate('INPUT', {type:'text', class:'hidden', id:'minieditor-text-field'})
	o.appendChild(i)
	i.addEventListener('keypress', this.onKeyPressed.bind(this))
	i.addEventListener('keydown', this.onKeyDown.bind(this))

	let t = DCreate('TEXTAREA', {class:'hidden', id:'minieditor-textarea'})
	o.appendChild(t)
	t.addEventListener('keypress', this.onKeyPressedTA.bind(this))
	t.addEventListener('keydown', this.onKeyDown.bind(this))		


	let bs = DCreate('BUTTONS')
	
	let bsave = DCreate('BUTTON', {id:'minieditor-btn-save', class:'btn-save', text:'Enregistrer'})
	bsave.addEventListener('click', this.onClickSave.bind(this))
	
	let bcanc = DCreate('BUTTON',{id:'minieditor-btn-cancel',class:'btn-cancel', text:'Renoncer'})
	bcanc.addEventListener('click', this.onClickCancel.bind(this))
	
	bs.appendChild(bsave)
	bs.appendChild(bcanc)
	o.appendChild(bs)
	
	document.body.appendChild(o)

	this.obj = o

	return true
}
}


