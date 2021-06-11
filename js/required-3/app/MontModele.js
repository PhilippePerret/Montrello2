'use strict'
/*

  Class MontModele
  ----------------
  Pour gérer les modèles de tout élément.

  Sous classes (sous cette classe)
  ------------
    ModelesChecklist    Pour gérer les modèles de checklist

  Un modèle est simplement :

    - un titre (pour le retrouver)
    - un type  (pour l'enregistrer et le classer plus facilement)
    - une référence (à l'objet à imiter)

  * L'objet de référence est le parent du modèle (puisque sa référen-
    ce est consignée dans :ow)
  * Noter que puisque le modèle est une référence à un objet, dès que
    l'objet est modifié, les prochains modèles le seront aussi.


  TODO
    - Indiquer qu'un objet est un modèle (pour savoir qu'en le 
      modifiant on modifiera les prochains modèles)
    - Quand un objet qui est modèle est détruit, il faut détruire
      aussi le modèle qui y est rattaché

*/
/**
  * Pour gérer les modèles de tout élément
  *
  */
class MontModele extends MontrelloObjet {

/**
 * Utile pour produire un nouveau modèle
 * 
 */
static newItemDataFor(objet){
  var modeleName = prompt("Quel nom donner à ce modèle ?", "")
  this.dimType = `m-${objet.type}`
  return this.defaultItemData(modeleName, objet)
}

static get items(){ return this._items || (this._items = {})}
static set items(v) { this._items = v}

// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------


get ref(){return this._ref||(this._ref =`${this.data.ty}-${this.data.id}`)}

/**
 * Appelée après la création du modèle
 * 
 */
afterCreate(){
  this.parent.isModele = true
}

// On ne doit rien construire ni observer
build_and_observe(){return true}


}//class MontModele
Object.assign(MontModele.prototype, TOMiniMethods)
Object.assign(MontModele.prototype, UniversalHelpersMethods)
Object.defineProperties(MontModele.prototype, TOMiniProperties)


/**
 * Pour gérer les modèles de checklist au niveau du formulaire de carte
 * 
 * Note : c'est une instance ModelesChecklist qui est attachée au menu
 *        des modèles de checklist, afin de permettre l'ajout d'une
 *        checklist dans une carte.
 */
class ModelesChecklist extends MontModele {
 
constructor(data){
  super(data||{})
  this.carteform = data.carteform
}

get items(){ 
  const items = Object.values(MontModele.items)
  var itemsCL = {}
  items.forEach(item => { item.type == 'm-cl' && Object.assign(itemsCL, {[item.id]: item}) })
  return itemsCL
}
onChooseItem(montModele){
  // console.log("[Instance] Le modèle de checklist suivant a été choisi pour ...", this.carteform, montModele)
  this.duplicateFor(montModele, this.carteform.carte)
  .then(newInstance => {
    // console.log("newInstance reçue : ", newInstance)
    this.carteform.carte.addChildItem(newInstance)
  })
}

/**
 * Méthode permettant de faire un duplicata de +montmodele+
 * 
 * Note : chaque classe de modèle définit son propre modèle
 * 
 */
async duplicateFor(montmodele, carte){
  const referent = montmodele.parent
  // console.log("Le référent (et ses données) : ", referent, referent.data)
  const data = Object.assign({}, referent.data)
  console.log("Data au départ", JSON.stringify(data))
  data.id = Montrello.getNewId(data.ty)
  data.ti = `Checklist pour la carte “${carte.titre}”`
  data.ow = carte.ref
  /**
   * Traitement des enfants
   * 
   * Noter que la liste ordonnées 'data.cho' n'existe pas toujours
   * et/ou qu'elle peut être incomplète si des enfants ont été ajou-
   * tés après un classement. Il faut donc toujours tester les deux
   * données.
   */
  if ( data.cho == null || data.cho.length != referent.children.length ) {
    // console.log("Le nombre d'enfants ne correspond pas")
    data.cho || (data.cho = []);
    referent.children.forEach(child => {
      if ( data.cho.indexOf(child.id) < 0 ) {
        // console.log("Il faut ajouter l'enfant dans data.cho", child)
        data.cho.push(child.id)
      }
    })
  }
  // Il faut maintenant créer des instances des enfants (CheckListTask)
  const oldCho = [...data.cho]
  const dataClasse = Montrello.type2dataClass(data.ty)
  data.cho = []
  let promises = [] // pour mettre les promesses
  var child, newChild;
  oldCho.forEach(async child_id => {
    return new Promise(async (ok,ko) => {
      child = dataClasse.childClass.get(child_id)
      // console.log("Enfant à dupliquer", child);
      newChild = await child.duplicateWith({ow:`${data.ty}-${data.id}`})
      // console.log("Enfant duplicata:", newChild);
      data.cho.push(newChild.id)
      ok()
    })
  })

  // Pour créer toutes les tâches
  await Promise.all(promises)

  // Ici data.cho est bien renseigné
  // console.log("Data ajustée", data)

  const newInstance = new CheckList(data)
  // On crée vraiment l'instance (en l'enregistrant et en la construisant)
  await newInstance.constructor.createItem(newInstance)

  return newInstance
}

}// class ModelesChecklist
