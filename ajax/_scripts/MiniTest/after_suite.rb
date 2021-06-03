# frozen_string_litteral: true
require 'fileutils'
require_relative 'required'

if File.exist?(BACKUP_PATH)
  FileUtils.rm_rf(DATA_MONTRELLO_PATH) if File.exist?(DATA_MONTRELLO_PATH)
  FileUtils.cp_r(BACKUP_PATH, DATA_MONTRELLO_PATH)
  Ajax << {message: "Les données initiales ont été remises."}
else
  Ajax << {message: "Aucune donnée initiale à remettre."}
end