'use strict'
/**
 * Helpers pour les tests Montrello
 *
 */


class TData {

/**
 * doc/
 * TData.get('<type>', <id>)
 * 
 *  Retourne les données de l'objet de type <type> et d'identifiant
 *  <id> en les relevant dans le fichier YAML.
 * 
 *  C'est une méthode asynchrone donc utiliser :
 * 
 *    let data = (await TData.get('<type>', <id>))
 * 
 * /doc
 */
static async get(objet_type, objet_id){
  let d = (await Ajax.send('load.rb', {type:objet_type, id:objet_id}))
  return d.data
}

}//class TData