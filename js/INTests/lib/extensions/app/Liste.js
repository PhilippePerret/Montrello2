'use strict'

const ExtensionListe = {

clickButtonNewCarte(){
  $(this.btnNewCarte).trigger('click')
},

get btnNewCarte(){
  return this._btnnewcarte || (this._btnnewcarte = DGet('footer button.btn-add', this.obj))
},

get btnDestroy(){return this.btnKill}

}

Object.assign(Liste.prototype, ExtensionListe)
