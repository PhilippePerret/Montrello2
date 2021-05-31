'use strict';
/** ---------------------------------------------------------------------

  MÉTHODES PRATIQUES
  ------------------
  Version 1.2.0

# 1.2.0
  Ajout de la méthode focusIn. Qui permet de focusser dans un élément
  en triggant un évènement focus.

# 1.1.1
  Amélioration de stopEvent pour désactiver encore plus de choses

# 1.1.0
  Modification de la méthode with_pixels -> px
  + Elle peut recevoir maintenant, dans les objets, des valeurs qui ont
    déjà leur unité et ne seront pas transformées. Pour ne pas avoir à
    compliquer la définition de l'attribut style lorsqu'il y a d'autres
    valeurs comme des zooms, des polices, etc.
# 1.0.2
  Ajout de la méthode 'px'
*** --------------------------------------------------------------------- */

// Pour focus dans un élément en triggant un évènement focus
// Mais bon… ça ne semble pas marcher…
function focusIn(element) {
  // var eventType = "onfocusin" in element ? "focusin" : "focus",
  //   , bubbles = "onfocusin" in element,
  //   , event;
  var eventType = 'focus'
    , bubbles = false
    , event

  if ("createEvent" in document) {
    event = document.createEvent("Event");
    event.initEvent(eventType, bubbles, true);
  }
  else if ("Event" in window) {
    event = new Event(eventType, { bubbles: bubbles, cancelable: true });
  }

  element.focus();
  element.dispatchEvent(event);
}

// Méthode à utiliser en catch des promesses
function onError(err){
  console.error(err)
  erreur("Une erreur est survenue, consulter la console.")
}

/**
* Pour ajouter les pixels aux valeurs numériques (*) :
*
* (String)  "12" => "12px"
* (Number)  12 => "12px"
* (Object)  {top: 24, left: 34} => {top: "24px", left: "34px"}
*
* Si +asStyle+ est true, on retourne la donnée sous forme d'attribut style
* c'est-à-dire {top:24, left:34} => "top:24px;left:34px;"
* (ça n'est bien entendu valable que pour les Object(s))
*
* (*) Et seulement aux valeurs numériques, c'est-à-dire qu'on peut
*     laisser des propriétés déjà réglées sans problème.
***/
function px(vals, asStyle = false){
  if ('string' == typeof(vals) || 'number' == typeof(vals)) {
    return `${vals}px`
  } else {
    var newh = {}
    for(var k in vals){
      var val = vals[k]
      Object.assign(newh, { [k]: (isNaN(val) ? val : val+'px') })
    }
    if (asStyle){
      var str = []
      for(var k in newh){str.push(`${k}:${newh[k]};`)}
      return str.join('')
    } else {
      return newh
    }
  }
}

function stringOrNull(v){
  if (!v) return null
  v = v.trim()
  if ( v == "" ) return null
  return v
}
function integerOrNull(v){
  if (!v) return null
  v = v.trim()
  if ( v == '' ) return null
  return parseInt(v,10)
}

/**
  Méthode à appeler lorsque c'est un retourn ajax qui ne doit pas faire,
  dans un `catch`. La donnée retournée par le script ajax ruby doit contenir
  `error` pour signaler une erreur et/ou `message` pour afficher un message.
**/
function onAjaxSuccess(ret){
  if ( ret.error ) return erreur(ret.error)
  if (ret.message) message(ret.message)
}

function raise(msg){
  erreur(msg)
  throw new Error(msg)
}

function stopEvent(ev){
  ev.stopPropagation();
  ev.preventDefault();
  ev.stopImmediatePropagation()
  ev.returnValue = false
  return false
}

function dorure(str){return `<span style="color:#e9e330;background-color:blueviolet;padding:1px 6px;">${str}</span>`}

function clip(what, msg){
  const field = DCreate('textarea',{text:what})
  document.body.appendChild(field)
  field.focus()
  field.select()
  document.execCommand('copy')
  msg && message(msg)
  field.remove()
}

/**
* Pour charger un module JS quelconque du dossier './js'
***/
function loadJS(moduleName){
  moduleName.endsWith('.js') || (moduleName += '.js')
  return new Promise((ok,ko)=>{
    const script = DCreate('SCRIPT',{src:`js/${moduleName}`, type:"text/javascript"})
    document.body.appendChild(script)
    script.addEventListener('load', ok)
  })
}
/**
* Pour charger un module du dossier 'js/module'
***/
function loadJSModule(moduleName){
  moduleName.endsWith('.js') || (moduleName += '.js')
  return new Promise((ok,ko)=>{
    const script = DCreate('SCRIPT',{src:`js/module/${moduleName}`, type:"text/javascript"})
    document.body.appendChild(script)
    script.addEventListener('load', ok)
  })
}
