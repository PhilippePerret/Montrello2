'use strict'

MiniTest.tests_list = [
  // 'minitest'
  'listes'
// , 'premier_tableau'
// , 'CheckList_test'
// , 'modele_checklist'

]

MiniTest.helpers_list = [
  'helpers'
, 'TMiniEditor' // helpers pour le mini-éditeur
, 'extensions/Tableau'
, 'extensions/Liste'
, 'extensions/Expectations'
]


MiniTest.config = {
    config: true

    /**
     * Niveau du débuggage. Tous les messages log(...,level) inférieur
     * ou égal à cette valeur seront affichés
     */
  , debug_level: 0

    /**
      * La méthode App.resetBeforeTest() doit être définie
      * 
      */
  , reset_before_each_test: true

    /**
     * Pour afficher ou non les messages de suivi
     * 
     */
  , hide_suivi_messages: false
}