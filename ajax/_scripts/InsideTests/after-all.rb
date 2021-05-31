# encoding: UTF-8
# frozen_string_literal: true
=begin
	
	À faire à la fin des inside-tests

=end
require_relative 'required'

LAST_BACKUP = BACKUPS_INFOS[:last_backup]
if LAST_BACKUP && File.exist?(LAST_BACKUP)
	FileUtils.rm_rf(MONTRELLO_FOLDER)
	FileUtils.cp_r(LAST_BACKUP, MONTRELLO_FOLDER)
	Ajax << {message: "Dernier backup remis avec succès"}
else
	Ajax << {message:"Pas de backup à remettre"}
end