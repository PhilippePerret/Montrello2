# encoding: UTF-8
require 'fileutils'
require 'json'

def log(msg)
  # TODO Reprogrammer
  puts msg
end

# Le dossier de l'application
# ---------------------------
# Contient quelque chose comme '/Users/moi/Sites/MonApplication'
#
Dir["#{APP_FOLDER}/ajax/required/**/*.rb"].each do |m|
  require m
end