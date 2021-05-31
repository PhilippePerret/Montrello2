# encoding: UTF-8
# frozen_string_literal: true
=begin
	Pour sauver tout type de données
=end
require 'yaml'

data = Ajax.param(:data).to_sym

class Objet
attr_reader :data
def initialize(data)
	@data = data
end

def id; @id ||= data[:id] end
def type; @type ||= data[:ty] end

def save
	File.delete(path) if File.exist?(path)
	File.open(path,'wb'){|f|f.write(YAML.dump(data))}
end
def path
	@path ||= File.join(folder, "#{id}.yaml")
end
def folder
	@folder ||= mkdir(File.join(APP_FOLDER,'data','montrello', type))
end
end

if data[:type] == 'config'
	path = File.join(APP_FOLDER,'data','montrello','config.yaml')
	if File.exist?(path)
		File.delete(path) 
	else
		mkdir(File.dirname(path)) # au cas où (tests ?)
	end
	File.open(path,'wb') { |f| f.write(YAML.dump(data)) }
else
	objet = Objet.new(data)
	objet.save
	Ajax << {message: "J'ai sauvé la donnée de type #{data[:ty]} dans #{objet.path}", data: data}
end

