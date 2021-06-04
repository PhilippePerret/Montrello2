'use strict'
/**
 * Class Page
 * ----------
 * Pour gérer la page dans les mini-tests
 * 
 * Permet d'utiliser les méthodes :
 * 
 *  page.contains(<le texte>)
 * 
 *      Penser à utiliser escapeRegExp(<le texte>) si caractères 
 *      spéciaux
 * 
 *  page.has(<selector>, <attrs>)
 */
class Page {

/**
 * doc/
 * page.contains("<string>")
 * 
 *  Retourne true si la page contient le texte <string>
 * 
 * /doc
 */
contains(msg){
  const res = document.body.innerHTML.match(msg)
  console.log("-> contains %s", msg, res)
  return res != null
}

/**
 * doc/
 * page.has("<selector>"[{<attributs>}])
 * 
 *  Retourne true si la page contient le selecteur spécifié avec les
 *  attributs optionnels.
 * 
 *  <attributs> peut contenir n'importe quel attribut de balise 
 *  HTML ou les valeurs spéciales :
 *    :in       Le contenaire dans lequel chercher.
 *    :count    Le nombre d'éléments qu'on doit trouver
 *    :text     Le texte que doit contenir le sélecteur.
 * 
 *  Par exemple :
 * 
 *    page.has('a', {href: "http://www.atelier-icare.net"})
 * 
 * /doc
 * 
 * +attrs+
 *    N'importe quel attribut HTML
 *    +
 *      :in       Le SELECTOR du container
 *      :count    Le nombre d'éléments qu'il faut trouver
 * 
 * @return TRUE si la page contient la balise définie
 * 
 */
has(selector, attrs){
  let container = document.body
  if ( attrs && attrs.in ) {
    container = document.body.querySelector(attrs.in)
    delete attrs.in
  }
  return HTML.has(container, selector, attrs)
}

}// class Page
window.page = new Page()