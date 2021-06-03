# frozen_string_litteral: true


=begin
  
  Module pour remonter tous les modèles

=end

folder_data = File.join(APP_FOLDER,'data','montrello')
modeles = []
Dir["#{folder_data}/m-*"].each do |fpath|
  Dir["#{fpath}/*.yaml"].each do |fmod|
    modeles << YAML.load_file(fmod)
  end
end

Ajax << {modeles: modeles}