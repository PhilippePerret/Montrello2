# encoding: UTF-8
# frozen_string_literal: true
=begin

  Production d'un backup des données

=end
require 'fileutils'

class OfficialBackups
class << self

  def data_folder
    @data_folder ||= File.join(APP_FOLDER,'data','montrello')
  end

  def official_backups_folder
    @official_backups_folder ||= mkdir(File.join(APP_FOLDER,'data','backups','officiels'))
  end

  def retrieve_official_backup
    # Trouver le dernier backup
    File.exist?(official_backups_folder) || raise("Aucun dossier de backup officiel pour le moment. Jouer 'backup' en console pour en produire un.")
    last_backup = Dir["#{official_backups_folder}/*"].sort.last
    last_backup != nil || raise("Aucun dossier de backup n'a été trouvé. Jouer 'backup' en console pour en produire un.")
    Ajax << {message: "Je dois remettre le backup #{last_backup.inspect}"}
    # Il se peut que l'utilisateur, bêtement, ait supprimer le dossier
    # des données actuels. Il faut donc vérifier son existence avant
    # de le supprimer.
    FileUtils.rm_rf(data_folder) if File.exists?(data_folder)
    # On peut maintenant remettre le dernier backup
    FileUtils.cp_r(last_backup, data_folder)
    if File.exist?(data_folder)
      Ajax << {message:"Récupération des données officielles à partir du dossier #{File.basename(last_backup)}."}
    else
      Ajax << {error:"Bizarrement, les dernières données officielles n'ont pas pu être récupérées."}
    end
  rescue Exception => e
    Ajax << {error: e.message, backtrace: e.backtrace}  
  end

  def produce_official_backup
    if not File.exist?(data_folder)
      Ajax << {error: "Aucun fichier de données n'existe pour le moment => pas de backup possible."}
    else
      backup_name = "backup-#{Time.now.strftime('%Y-%m-%d-%H-%M')}"
      backup_path = File.join(official_backups_folder,backup_name)
      FileUtils.cp_r(data_folder, backup_path)

      # Retour
      if File.exist?(backup_path)
        Ajax << {message:"J'ai produit un backup officiel des données actuelles avec le nom #{backup_name}."}
      elsif 
        Ajax << {error:"Apparemment, je n'ai pas réussi à produire un backup officiel des données actuelles (sans raison donnée)…"}
      end
    end
  end

end #/<< self
end #/OfficialBackups
