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
contains(msg){
  const res = document.body.innerHTML.match(msg)
  console.log("-> contains %s", msg, res)
  return res != null
}

/**
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

  let count = null;
  if (attrs && attrs.count){
    count = 0 + attrs.count
    delete attrs.count
  }
  ;(attrs && Object.keys(attrs).length) || (attrs = null)

  if ( attrs ) {
    for(var attr in attrs){
      selector += `[${attr}="${attrs[attr]}"]`
    }
  }

  // console.log("Recherche de %s", selector, container.querySelector(selector))

  if ( count ) {
    res = container.querySelectorAll(selector)
    return res.length == count
  } else {
    return container.querySelector(selector) != null
  }

}

}// class Page
window.page = new Page()