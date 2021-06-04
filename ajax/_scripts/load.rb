# encoding: UTF-8
# frozen_string_literal: true
=begin
	Chargement de toutes les données par type
=end
require 'yaml'

type 		= Ajax.param(:type) || Ajax.param(:ty)
opt_id 	= Ajax.param(:id) # seulement si un identifiant est fourni

path_type = File.join(APP_FOLDER,'data','montrello', type.to_s)
path_type = "#{path_type}.yaml" if type == 'config'
	
data =
if type == 'config'
	if File.exist?(path_type)
		YAML.load_file(path_type)
	else
		{ty:'config'}
	end
else
	if File.exist?(path_type)
		Dir["#{path_type}/*.yaml"].collect{ |fpath| YAML.load_file(fpath) }
	else
		[]
	end
end

if opt_id
	found = nil
	data.each do |hdata|
		if hdata[:id] == opt_id
			found = hdata
			break
		end
	end
	data = found
end

Ajax << {data:data, type:type}