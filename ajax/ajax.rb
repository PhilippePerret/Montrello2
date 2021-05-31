# frozen_string_litteral: true
# encoding: UTF-8
require_relative 'required'

class Ajax
class << self

  attr_reader :params, :data

  def treate_request(req)

    @params = req.params

    # 
    # Réinitialiser chaque fois les données à retourner
    # 
    @data = {error: nil, message: nil}

    # puts "params : #{params.inspect}::#{params.class}"

    #
    # Le script à exécuter
    # 
    script_name = param(:script)

    self << {script: script_name}
    
    # 
    # Le script doit exister
    # 
    script_fullpath = File.expand_path(File.join(APP_FOLDER,'ajax','_scripts',script_name))
    if File.exist?(script_fullpath)
      begin
        load script_fullpath
      rescue Exception => e
        raise e
      end
    else
      self << {error: "Le script '#{script_fullpath}' est introuvable…"}
    end

    # On ajoute au retour, le script joué et les clés envoyés en
    # paramètres CGI
    self << {
      'transmited_keys': params.keys.join(', '),
      'APP_FOLDER': APP_FOLDER
    }

    return data.to_json

  rescue Exception => e
    error(e)
    err = Hash.new
    err.merge!(error: Hash.new)
    err[:error].merge!(message: e.message)
    err[:error].merge!(backtrace: e.backtrace)
    
    return err.to_json

  end

  # # Retourne l'argument de clé +key+
  # def arg key
  #   args[key.to_s]
  # end
  #
  # # ---------------------------------------------------------------------
  # Pour ajouter des données à renvoyer
  # Utiliser : Ajax << {ma: "data"}
  def << hashdata
    @data.merge!(hashdata)
  end

  # Pour mettre dans le rescue des scripts (cf. manuel)
  def error e
    log("ERREUR: #{e.message}")
    log("BACKTRACE ERREUR: #{e.backtrace.join("\n")}")
    self << {error: e.message, backtrace: e.backtrace}
  end

  def param key
    return nil if params[key.to_s].empty?
    # log("params[#{key.inspect}.to_s] = #{params[key.to_s].inspect}")
    v, typeV = JSON.parse(params[key.to_s])
    # log("v, typeV de #{key.inspect} = #{v.inspect}, #{typeV.inspect}")
    return case typeV
    when 'number'   then v = v.to_i
    when 'boolean'  then v = v
    when 'json'     then v = JSON.parse(v)
    else v
    end
  end

end #/ << self
end
