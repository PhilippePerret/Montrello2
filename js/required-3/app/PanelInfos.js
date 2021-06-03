'use strict'
/**
  * Classe PanelInfos
  * -----------------
  * Gestion des informations générales de l'application qui sont
  * affichées en bas à droite de l'écran
  *
  */

class PanelInfos {

/**
 * Constantes des données à afficher
 * 
 */
static get DATA_PANEL_INFOS(){
  return this._dataPanelInfos || (this._dataPanelInfos = [
      {id:'tbl', name:'Tableaux',     classe:Tableau}
    , {id:'lst', name:'Listes',       classe:Liste}
    , {id:'crt', name:'Cartes',       classe:Carte}
    , {id:'ckl', name:'Checklists',   classe:CheckList}
    , {id:'tsk', name:'Tâches',       classe:CheckListTask}
    , {id:'mst', name:'Massets',      classe:Masset}
  ])
}

/**
 * Initiation du panneau, à la fin du chargement de l'application
 * 
 */
static init(){
  this.build()
  this.update()
}

/**
 * Construction du panneau
 * 
 */
static build(){
  this.obj = document.createElement('PANNEL_INFOS')
  // On construit une rangée par donnée à surveiller
  this.DATA_PANEL_INFOS.forEach(dinfo => {
    const div = DCreate('DIV',{class:'info'})
    div.appendChild(DCreate('SPAN', {class:'label', text:dinfo.name}))
    div.appendChild(DCreate('SPAN', {class:'value', id:`panel-info-${dinfo.id}`}))
    this.obj.appendChild(div)
  })
  document.body.appendChild(this.obj)
}

/**
 * Actualise l'affichage des informations
 * Doit être appelée après chaque création/suppression
 * 
 */
static update(){
  if ( this.obj ) {
    this.DATA_PANEL_INFOS.forEach(dinfo => {
      // console.log("dinfo.classe", dinfo.classe)
      // console.log("dinfo.classe.items", dinfo.classe.items)
      var count
      if ( !dinfo.classe.items ) count = 0
      else { count = Object.keys(dinfo.classe.items).length }
      DGet(`#panel-info-${dinfo.id}`, this.obj).innerHTML = count
    })
  } else {
    /** Cela arrive au tout premier lancement de l'application, par
     * exemple, lorsqu'un premier tableau est créé mais que le 
     * panel-info ne l'est pas encore
     */
    return    
  }
}

}