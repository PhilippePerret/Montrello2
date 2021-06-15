# frozen_string_litteral: true

class INTests
class << self

# L'instance INTests du test courant
def get_current_test
  puts "File.exist?(suivi_path) est #{File.exist?(suivi_path).inspect}"
  @is_start_tests = not(File.exist?(suivi_path))
  if @is_start_tests
    # <=  Le fichier 'suivi' n'existe pas
    #  => C'est le début du test, il faut mettre dans ce fichier 
    #     tous les tests à jouer
    puts "Le fichier suivi n'existe pas, je le crée avec #{CONFIG[:tests_on].reverse.inspect}"
    File.open(suivi_path,'wb'){|f|f.write(CONFIG[:tests_on].reverse.join("\n"))}
  end
  # 
  # On prend le prochain test
  # 
  tests = File.read(suivi_path).split("\n")
  puts "tests au départ : #{tests.inspect}"
  test_current_name = tests.pop.freeze  # la liste a été enregistrée à l'envers
  # 
  # On ré-enregistre la liste, sauf s'il n'y a plus de tests
  # 
  File.delete(suivi_path)
  @has_next_test = not(tests.empty?)
  puts "@has_next_test = #{@has_next_test.inspect} (#{self.next_test?.inspect})"
  if @has_next_test
    File.open(suivi_path,'wb'){|f|f.write(tests.join("\n"))}
  end
  INTests.new(test_current_name)
end

# 
# Retourne TRUE s'il y a encore un test après
# 
def next_test?
  @has_next_test
end

# 
# Retourne TRUE si c'est le début des tests
# 
def start?
  @is_start_tests
end

def suivi_path
  @suivi_path ||= File.join(INTESTS_FOLDER_DATA,'suivi')
end

end #/<< self



attr_reader :name
def initialize(name)
  @name = name
end

# 
# = main =
# 
# Méthode principale activant le test, c'est-à-dire mettant son
# dossier en dossier de données Montrello
# 
def activate
  gel = File.join(INTESTS_FOLDER_DATA,'gels',config[:gel])
  FileUtils.rm_rf(DATA_MONTRELLO_PATH)
  FileUtils.cp_r(gel,DATA_MONTRELLO_PATH)
end

def config
  @config ||= YAML.load_file(File.join(folder,'config.yaml'))
end

def path_js
  @path_js ||= File.join(folder,"#{name}.js")
end
def folder
  @folder ||= File.join(INTESTS_FOLDER_JS,'tests',name)
end


end