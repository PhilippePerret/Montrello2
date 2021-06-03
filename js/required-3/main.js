'use strict';

$(document).ready(function(){
	 UI.insert(					'header', 					'body')
  .then(UI.insert.bind(UI, 	'modele_tableau', 	'modeles'))
  .then(UI.insert.bind(UI, 	'modele_liste', 	 	'modeles'))
  .then(UI.insert.bind(UI, 	'modele_carte', 	 	'modeles'))
  .then(UI.insert.bind(UI, 	'modele_task', 	 		'modeles'))
  .then(UI.insert.bind(UI,  'modele_checklist', 'modeles'))
  .then(UI.insert.bind(UI,  'modele_massets',   'modeles'))
  .then(UI.insert.bind(UI,  'picker_tags',      'modeles'))
  .then(UI.insert.bind(UI,  'picker_dates',     'modeles'))
  .then(UI.insert.bind(UI, 	'carte_form', 			'modeles'))
  .then(UI.insert.bind(UI,	'footer', 					'body'))
  /**
   * Si on veut lancer les tests plutôt que l'application, on décommente la ligne
   * suivante et on commente les deux lignes d'après.
   */
  .then(MiniTest.run.bind(MiniTest))
  // .then(UI.init.bind(UI))
  // .then(Montrello.init.bind(Montrello))
  .catch(console.error)
  

})
