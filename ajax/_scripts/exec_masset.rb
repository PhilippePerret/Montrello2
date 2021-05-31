# encoding: UTF-8
# frozen_string_literal: true
=begin
	
	Exécution d'un "M-Asset"

=end

class Masset
attr_reader :data
def initialize(data)
	@data = data
end

# Exécute le masset
# Et retourne le résultat
def exec_per_type
	log("-> exec_per_type / data : #{data.inspect}")
	case data['mty']
	when 'cmd'
		`#{content} 2>&1`
	when 'flj'
		`open -a Finder "#{content}" 2>&1`
	when 'fld'
		`open -a Finder "#{content}" 2>&1`
	when 'url'
		# Normalement, ne devrait pas arriver, ça s'exécute dans l'app
	end
end

def content
	@content ||= data['co']
end
end #/class Masset

masset = Masset.new(Ajax.param(:data))
res = masset.exec_per_type

Ajax << {resultat: res}