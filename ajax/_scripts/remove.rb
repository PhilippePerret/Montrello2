# encoding: UTF-8
# frozen_string_literal: true
=begin
	
	Destruction d'un objet

=end

objet_type 	= Ajax.param(:type)
objet_id 		= Ajax.param(:id)

p = File.join(APP_FOLDER,'data','montrello', objet_type)
if File.exist?(p)
	p = File.join(p, "#{objet_id}.yaml")
	if File.exist?(p)
		File.delete(p)
		Ajax << {message: "Objet #{objet_type}-#{objet_id} détruit avec succès."}
	else
		Ajax << {error: "L'objet #{p} est introuvable."}
	end
else
	Ajax << {error: "Le dossier #{p} est introuvable."}
end

