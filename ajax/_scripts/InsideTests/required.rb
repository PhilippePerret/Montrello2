# encoding: UTF-8
# frozen_string_literal: true

require 'fileutils'
require 'yaml'

DATA_FOLDER 			= File.join(APP_FOLDER,'data')
MONTRELLO_FOLDER 	= File.join(DATA_FOLDER,'montrello')
BACKUPS_FOLDER = mkdir(File.join(APP_FOLDER,'data','montrello_backups'))

BACKUPS_INFOS_FILE = File.join(BACKUPS_FOLDER,'_infos.yaml')

BACKUPS_INFOS = 
if File.exist?(BACKUPS_INFOS_FILE)
	YAML.load_file(BACKUPS_INFOS_FILE)
else
	{}
end
