# encoding: UTF-8
# frozen_string_literal: true
=begin
	
	Destruction d'un objet quelconque

=end
require_relative 'lib/Objet'

objet = Objet.new(Ajax.param(:ref).to_sym)

if objet.exist?
	File.delete(objet.path)
	Ajax << {message: "Objet #{objet.ref} détruit avec succès."}
else
	Ajax << {error: "L'objet #{objet.path} est introuvable."}
end
