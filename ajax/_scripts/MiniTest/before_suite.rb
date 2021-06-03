# frozen_string_litteral: true
=begin
  
  Module appelé en début des tests MiniTest
  À implémenter en fonction de l'application.

=end
require 'yaml'
require 'fileutils'
require_relative 'required'

# On regarde si un dossier data/montrello/tb existe et,
# si c'est le cas, on regarde s'il contient un tableau qui 
# s'appelle 'Icariens'. Si c'est le cas, on peut mettre ces données
# de côté car ce sont vraiment des bonnes données. Sinon, on ne
# touche à rien.

msg_final = "J'ai mis les données de côté."

begin
  data_montrello_path = File.join(APP_FOLDER,'data','montrello')
  File.exist?(data_montrello_path) || raise("Le dossier des données Montrello n'existe pas (encore)")
  path = File.join(data_montrello_path, 'tb')
  File.exist?(path) || raise("Aucune donnée de tableau n'est encore enregistré")
  tableau_trouved = false
  Dir["#{path}/*.yaml"].each do |fpath|
    if YAML.load_file(fpath)[:ti] == 'Icariens'
      tableau_trouved = true
      break
    end
  end
  tableau_trouved || raise("Aucun tableau de porte le titre 'Icariens'")

  # 
  # Le tableau a été trouvé, il faut donc mettre les données actuelles 
  # de côté pour pouvoir les remettre à la fin des tests.
  # 
  FileUtils.rm_rf(BACKUP_PATH) if File.exist?(BACKUP_PATH)
  FileUtils.cp_r(data_montrello_path, BACKUP_PATH)
rescue Exception => e
   msg_final = "#{e.message}. Rien à mettre de côté."
end
Ajax << {message: msg_final}