'use strict'

MiniTest.tests_list = [
 'modele_checklist' // plus bas aussi avec une virgule
  // 'minitest'
  // 'listes'
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
     * Si true, on remet l'état initial à la fin des tests. Sinon, on
     * garde l'état de fin de test et il faudra remettre les données
     * initiales à la main.
     */
  , retreive_init_state_at_end: false

    /**
      * La méthode App.resetBeforeTest() doit être définie
      * OBSOLÈTE (maintenant, l'application est rechargée avant
      * chaque test)
      */
  , reset_before_each_test: true

    /**
     * Pour afficher ou non les messages de suivi
     * 
     */
  , hide_suivi_messages: false
}