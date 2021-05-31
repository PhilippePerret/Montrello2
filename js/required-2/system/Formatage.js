'use strict'
/** ---------------------------------------------------------------------
  *   Module Formatage

Des méthodes pour faciliter le code

*** --------------------------------------------------------------------- */

function code(str){
  return `<code>${str}</code>`
}

function capitalize(str){
  return str.substring(0,1).toUpperCase() + str.substring(1)
}

function formate_date(date, format){
  format = format || '%J %d %M %Y'
  // console.log("date, date.getDay() = ", date, date.getDay())
  format = format.replace(/%j/g, JOURS[date.getDay()].short)
  format = format.replace(/%J/g, JOURS[date.getDay()].long)
  format = format.replace(/%d/g, date.getDate())
  format = format.replace(/%Y/g, date.getFullYear())
  format = format.replace(/%m/g, date.getMonth() + 1)
  format = format.replace(/%M/g, MOIS[date.getMonth()].long)
  format = format.replace(/%mm/g, MOIS[date.getMonth()].short)

  return format
}
