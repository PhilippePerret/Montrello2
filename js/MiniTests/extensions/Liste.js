'use strict'

const ExtensionListe = {

clickButtonNewCarte(){
  console.log("btnNewCarte", this.btnNewCarte)
  $(this.btnNewCarte).trigger('click')
},

get btnNewCarte(){
  return this._btnnewcarte || (this._btnnewcarte = DGet('footer button.btn-add', this.obj))
},

}

Object.assign(Liste.prototype, ExtensionListe)
// Object.defineProperties(Liste.prototype,{
//   btn
// })