# encoding: UTF-8
# frozen_string_literal: true
=begin
	Chargement de toutes les données par type
=end
require 'yaml'

type = Ajax.param(:type)

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
	log("type:#{type.inspect}, path:#{path_type.inspect} existe ? #{File.exist?(path_type).inspect}")
	if File.exist?(path_type)
		Dir["#{path_type}/*.yaml"].collect{ |fpath| YAML.load_file(fpath) }
	else
		[]
	end
end

log("type:#{type.inspect} data: #{data.inspect}")

Ajax << {data:data, type:type}