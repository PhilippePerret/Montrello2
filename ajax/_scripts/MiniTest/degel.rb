# frozen_string_litteral: true
require 'fileutils'
require_relative 'required'

gel_name = Ajax.param(:gel_name)


# --- Définir ci-dessous la méthode pour produire un dégel ---

gel_path = File.join(MONTRELLO_FOLDER_GEL,gel_name,'montrello')
if File.exist?(gel_path)
  FileUtils.rm_rf(DATA_MONTRELLO_PATH) if File.exist?(DATA_MONTRELLO_PATH)
  FileUtils.cp_r(gel_path, DATA_MONTRELLO_PATH)
  Ajax << {message: "Gel #{gel_name} dégelé avec succès"}
else
  Ajax << {error: "Le gel #{gel_path} est introuvable."}
end
