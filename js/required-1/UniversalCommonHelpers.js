'use strict'
/*

  Certaines méthodes doivent être partagées en même temps par les 
  objets Montrellos et le formulaire d'édition des cartes. On les
  place dans ce Add-on (pour faire les mixins)

*/
const UniversalHelpersMethods = {

  /**
    * Pour régler la jauge de développement que peut posséder l'objet
    */
  setJaugeDev(){
    DGet('devjauge', this.obj) && DevJauge.setIn(this)
  },

  /**
    * Méthode qui règle dans l'objet (*) les propriétés communes, par
    * exemple le titre ou l'identifiant.
    *
    * (*) Ou dans l'édition de la carte.
    */
  setCommonDisplayedProperties(){
    const verbose = false
    verbose && console.log("-> setCommonDisplayedProperties", this)
    this.commonDisplayedProperties.forEach(prop => {
      const o = this.obj.querySelector(`*[data-prop="${prop}"]`)
      if ( undefined == o ) return
      if ( ! this[prop] ) return
      verbose && console.log("Mettre la propriété %s à '%s' dans", prop, this[prop], o)
      o.innerHTML = this[prop]
    })
    verbose && console.log("<- setCommonDisplayedProperties")
  },

  editTags(btn, ev){
    this.pickertags || (this.pickertags = PickerTags.new(this))
    this.pickertags.checkColors(this.tags)
    this.pickertags.positionne(btn)
  },

  setTags(tagListIds){
    this.tags = numberizeIn(tagListIds) // liste de nombres
  },

  editDates(btn, ev){
    this.pickerdates || (this.pickerdates = PickerDates.new(this))
    this.pickerdates.positionne(btn)
    this.pickerdates.displayDates()
  },

  setDates(hvalues) { this.set({dates: hvalues}) },

}