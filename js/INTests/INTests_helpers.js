'use strict'


async function intests_action(msg, delay = 2){
  INTestsAction.current = new INTestsAction(msg)
  await INTestsAction.current.display_and_wait(delay)
}

class INTestsAction {

static get current(){return this._current}
static set current(v){
  if ( this._current ){ 
    log("L'INTestsAction courant existe", -1) // toujours affiché
    this._current.remove()
  }
  this._current = v
}

constructor(msg){
  this.message = msg
}

async display_and_wait(delay){
  this.build()
  await wait(delay)
  this.vanish()
}

build(){
  this.obj = DCreate('DIV', {class:'intests-action', text: this.message})
  document.body.appendChild(this.obj)
  let w = this.obj.getBoundingClientRect().width
  this.obj.style.left = px(parseInt((Window.width - w) / 2, 10))
}

vanish(){
  this.timer = setTimeout(this.remove.bind(this), 2*1000)
}
remove(){
  clearTimeout(this.timer)
  this.obj.remove()
  delete this.timer
}

}