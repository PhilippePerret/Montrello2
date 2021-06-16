# encoding: UTF-8
# frozen_string_literal: true
=begin
	Pour sauver toutes les données envoyées par :all
=end
require 'yaml'
require_relative 'lib/Objet'

alldata = Ajax.param(:all)

if alldata.nil?
	raise "+data+ est nil. Je ne peux pas procéder à la sauvegarde."
end

saved = alldata.collect do |data|
	data = data.to_sym
	objet = Objet.new(data)
	objet.save
	"#{data[:ty]}-#{data[:id]}" # pour le message
end

Ajax << {message: "Données sauvées : #{saved.join(', ')}"}

