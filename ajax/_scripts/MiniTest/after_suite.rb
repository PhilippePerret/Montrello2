# frozen_string_litteral: true

require 'fileutils'
require_relative 'required'

msg = []

if !Ajax.param(:ini_state)
  msg << "Il faudra remettre les données initiales à la main (#{BACKUP_PATH})"
elsif File.exist?(BACKUP_PATH)
  FileUtils.rm_rf(DATA_MONTRELLO_PATH) if File.exist?(DATA_MONTRELLO_PATH)
  FileUtils.cp_r(BACKUP_PATH, DATA_MONTRELLO_PATH)
  msg << "Les données initiales ont été remises."
else
  msg << "Aucune donnée initiale à remettre."
end

if Ajax.param(:data_tests)
  path_data_tests = mkdir(File.join(MINITEST_FOLDER,'results'))
  path_data_tests = File.join(path_data_tests, "Test du #{Time.now}.yaml")
  File.open(path_data_tests,'wb'){|f|f.write(YAML.dump(Ajax.param(:data_tests)))}
  msg << "Les données du test ont été enregistrées dans #{path_data_tests}"
end

Ajax << { message: msg.join("\n")}