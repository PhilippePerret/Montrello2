# frozen_string_litteral: true
=begin

  Classe Objet
  ------------
  Pour gérer tous les objets Montrello, c'est-à-dire, à la base,
  des objets qui ont un type et un identifiant (Tableau, Liste, 
  Carte, etc.)

=end

class Objet
attr_reader :data
def initialize(data)
  @data = data
end

def id; @id ||= data[:id] end
def type; @type ||= data[:ty] end

def ref
  @ref ||= "#{type}-#{id}"
end

def exist?
  File.exist?(path)
end
alias :exists? :exist?

def save
  File.delete(path) if File.exist?(path)
  File.open(path,'wb'){|f|f.write(YAML.dump(data))}
end
def path
  @path ||= File.join(folder, "#{id}.yaml")
end
def folder
  @folder ||= mkdir(File.join(APP_FOLDER,'data','montrello', type))
end
end
