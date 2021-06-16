# frozen_string_litteral: true
=begin

  Module pour retourne le nombre d'éléments voulus

=end

type = Ajax.param(:type) # par exemple 'tk'

folder_path     = File.join(APP_FOLDER,'data','montrello', type)
folder_elements = Dir["#{folder_elements}/*.yaml"]

Ajax << { count: folder_elements.count}