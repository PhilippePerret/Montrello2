'use strict'
/**
 * Helper pour les objet HTMLElement
 * 
 */
class HTML {

static has(container, selector, attrs){
  attrs = attrs || {}

  // console.log("HTML.has avec", container, selector, attrs)
  
  let count = null
    , text  = null
    , founds
    ;

  if (attrs.count){
    count = 0 + attrs.count
    delete attrs.count
  }

  if (attrs.text){
    text = "" + attrs.text
    delete attrs.text
  }

  ;(attrs && Object.keys(attrs).length) || (attrs = null)

  if ( attrs ) {
    for(var attr in attrs){
      selector += `[${attr}="${attrs[attr]}"]`
    }
  }

  // console.log("Recherche de %s", selector, container.querySelector(selector))
  founds = container.querySelectorAll(selector)

  // Cas de aucun sélecteur trouvé et nombre recherché différent
  // de zéro => erreur
  if ( founds.length == 0 && count != 0) return false

  if ( text ) {
    // Il faut qu'un des selectors trouvés possède ce texte
    var regText = escapeRegExp(text)
    var prevFounds = [...founds]
    founds = []
    prevFounds.forEach(found => {
      if ( found.innerHTML.match(regText) ) {
        founds.push(found)
      }
    })
  }
  if ( count ) {
    // S'il faut un nombre précis
    return founds.length == count
  } else {
    // S'il faut juste qu'il existe
    return founds.length > 0
  }

}

/**
 * Reçoit un objet est retourne un sujet au format humain
 * par exemple "div#mon-div"
 * 
 */
static hsujet(obj){
  var s = obj.tagName
  if ( obj.id ) {
    s += `#${obj.id}`
  } else if (obj.className) {
    obj.className && (s += `.${obj.className}`)
  } else {
    s += '<indéfini>'
  }
  return s
}

}