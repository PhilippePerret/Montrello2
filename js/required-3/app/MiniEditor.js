'use strict'

class MiniEditor {

	// 
	// = main =
	// 
	// Méthode principale appelée par un objet possédant la classe
	// 'editable'
	// 
	static edit(element){
		this.miniEditor || this.buildMiniEditor()
		this.miniEditor.edit(element)
	}

	static buildMiniEditor(){
		this.miniEditor = new MiniEditor()
		this.miniEditor.build()
	}

edit(element){
	this.element = element
	this.forSpan = element.tagName != 'DIV'
	this.prepare({text: element.innerHTML})	
	this.show()
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
	// console.log("position:", this.element.getBoundingClientRect())
	const rectE = this.element.getBoundingClientRect()
	this.obj.style.top 	= (parseInt(rectE.top)) + 'px'
	let newLeft = parseInt(rectE.left,10) - 15
	if (newLeft < 20) newLeft = 20
	this.obj.style.left = px(newLeft)
}

show(){
	this.obj.classList.remove('hidden')
	this.textField.focus()
	this.textField.select()
}
hide(){this.obj.classList.add('hidden')}


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
	// this.element.innerHTML = this.value
	// console.log("this.element = ", this.element)
	// console.log("this.element.owner = ", this.element.owner)
	// console.log("this.property = ", this.element.getAttribute('data-prop'))
	// Il faut aller plus loin = modifier la propriété dans l'objet
	this.element.owner.set({[this.element.getAttribute('data-prop')]: this.value})
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


