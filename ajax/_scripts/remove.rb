# encoding: UTF-8
# frozen_string_literal: true
=begin
	
	Destruction d'un objet quelconque

=end
require_relative 'lib/Objet'

if Ajax.param(:ref)

	# 
	# Destruction d'un seul objet
	# 

	objet = Objet.new(Ajax.param(:ref))
	if objet.exist?
		objet.delete
		Ajax << {message: "Objet #{objet.ref} détruit avec succès."}
	else
		Ajax << {error: "L'objet #{objet.path} est introuvable."}
	end

elsif Ajax.param(:refs)

	# 
	# Destruction d'un ensemble d'objets
	# 

	# Note : ici, contrairement à l'utilisation avec un seul objet, 
	# c'est une référence String qui est envoyée, comme "tb-4" pour
	# le tableau d'identifiant 4
	objets_detruits = []
	Ajax.param(:refs).each do |ref|
		objet = Objet.new(ref)
		next if not objet.exist?
		objet.delete
		objets_detruits << ref
	end
	Ajax << {message: "#{objets_detruits.count} objets détruits (#{objets_detruits.inspect})"}

else
	
	Ajax << {error: "Je ne sais pas quoi détruire…"}

end