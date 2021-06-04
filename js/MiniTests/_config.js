'use strict'


MiniTest.tests_list = [
    'helpers'
  , 'premier_tableau'

]

MiniTest.config = {
    config: true

    /**
     * Niveau du débuggage. Tous les messages log(...,level) inférieur
     * ou égal à cette valeur seront affichés
     */
  , debug_level: 3

    /**
      * La méthode App.resetBeforeTest() doit être définie
      * 
      */
  , reset_before_each_test: true
}