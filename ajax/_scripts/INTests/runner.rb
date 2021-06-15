# frozen_string_litteral: true
=begin

  Situations possibles :

    1) Aucun test n'est à jouer => on ne renvoie rien
    2) Un test est à jouer, et c'est le premier (aucun test en cours)
    3) Un test est à jouer, mais ça n'est pas le dernier
    4) Un test est à jouer et c'est le dernier
        (noter que ça peut être aussi le premier et le dernier)
=end
require_relative 'lib/required'

current_test = INTests.get_current_test

if INTESTS_ON
  # <= Les tests sont à jouer (sauf s'il n'y en a plus)
  current_test.activate
end

Ajax << {
  intest_name: INTESTS_ON ? current_test.name : nil, 
  intest_path: INTESTS_ON ? current_test.path_js : nil, 
  run_intests: CONFIG[:run],
  has_next_intest: INTests.next_test?
}