'use strict'
/*
  Methods helpers pour le gel courant
*/

Object.defineProperties(window, {
  carteParc:{
    get:function(){return DGet('carte#ca-23')}
  },
  carteFormParc:{
    get:function(){return DGet('carte_form#carteform-23')}
  },
  modelesCLinParcForm:{
    get(){ return DGet('liste_actions.for-objets menu.modeles-checklists', carteFormParc) }
  },
  
  itemCL_FabricationLivre:{
    get(){
      return DGet('li.m-cl-2-name', modelesCLinParcForm)
    }
  }  
})

