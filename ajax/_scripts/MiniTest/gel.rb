# frozen_string_litteral: true
require 'fileutils'
require_relative 'required'

gel_name = Ajax.param(:gel_name)
gel_desc = Ajax.param(:gel_description)

# --- Définir ci-dessous la méthode pour produire un gel ---

Ajax << {error:"Rien n'est défini dans #{__FILE__} pour produire le gel."}