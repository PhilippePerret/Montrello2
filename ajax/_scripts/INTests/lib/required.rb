# frozen_string_litteral: true
require 'yaml'

require_relative 'required/constants'
require_relative 'required/INTests'

config_path = File.join(INTESTS_FOLDER_DATA, 'config.yaml')
CONFIG = YAML.load_file(config_path)
INTESTS_ON = CONFIG[:run] === true