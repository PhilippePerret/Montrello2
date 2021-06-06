# encoding: UTF-8
# frozen_string_literal: true
=begin
	Pour sauver tout type de données
=end
require 'yaml'
require_relative 'lib/Objet'

data = Ajax.param(:data)

if data.nil?
	raise "+data+ est nil. Je ne peux pas procéder à la sauvegarde."
end

if not data.respond_to?(:to_sym)
	raise "+data+ (#{data.inspect}::#{data.class}) devrait répondre à ma méthode :to_sym. Ça n'est pas le cas. Impossible de procéder à la sauvegarde."
end

# 
# Tout est bon, on peut transformer en table avec clés symboliques
# 
data = data.to_sym


if data[:ty] == 'config'
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

