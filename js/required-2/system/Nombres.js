'use strict'

function getRandom(min, max){
  if ( undefined == max ) { [min, max] = [0, min] }
  return min + Math.floor(Math.random() * Math.floor(max))
}


function extract_number(n){
	if ( 'string' != typeof(n) ) return n
	const isNegative = n.substring(0,1) == '-'
	isNegative && (n = n.substring(1, n.length))
	n = n.replace(/[^0-9.]/g,'')
	if ( n.indexOf('.') < 0 ) {
		n = parseInt(n,10)
	} else {
		n = parseFloat(n)
	}
	isNegative && (n = -n)
	return n
}