# encoding: UTF-8
# frozen_string_literal: true
=begin
	
	À faire au début des inside-tests

=end
require_relative 'required'

# On ne fait un backup que si le dossier n'est pas vide
if Dir["#{MONTRELLO_FOLDER}/*"].count > 0
	BACKUP_FOLDER = File.join(BACKUPS_FOLDER, "#{Time.now.strftime('%Y-%m-%d-%H-%M-%S')}")
	FileUtils.cp_r(MONTRELLO_FOLDER,BACKUP_FOLDER)
	BACKUPS_INFOS.merge!(last_backup: BACKUP_FOLDER)
	File.open(BACKUPS_INFOS_FILE,'wb'){|f|f.write(YAML.dump(BACKUPS_INFOS))}
	if File.exist?(BACKUP_FOLDER)
		FileUtils.rm_rf(MONTRELLO_FOLDER)
		mkdir(MONTRELLO_FOLDER)
		Ajax << {message: "Backup exécuté avec succès"}
	else
		Ajax << {error:"Le backup n'a pas pu se faire correctement…"}
	end
else
	Ajax << {message:"Le dossier des données Montrello est vide, je ne fais pas de backup"}
end
