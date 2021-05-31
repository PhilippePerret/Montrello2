# frozen_string_literal: true
require 'fileutils'
require 'sass'

class App

  def call(env)
    request_path = env['REQUEST_PATH']
    if request_path == '/'
      [200, {'Content-Type' => 'text/html'}, [_html_code]]
    elsif request_path == '/ajax'
      require File.join(APP_FOLDER,'ajax','ajax')
      resultat = Ajax.treate_request(Rack::Request.new(env))
      [200, {'Content-Type' => 'application/json; charset:utf-8;'}, [resultat]]
    else
      puts "Path non traitée (env['REQUEST_PATH']) : #{env['REQUEST_PATH'].inspect}"
    end
  end

  #
  # {String} Body de l'application
  #
  def _html_code
    _sass_all # Actualisation des CSS
    <<-HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>#{site.title}</title>
  <link rel="stylesheet" type="text/css" href="css/main.css" />
</head>
<body>
#{_body}
#{_all_javascript}
</body>
</html>
    HTML
  end

  # 
  # {String} Le corps de la page
  # 
  def _body
    [1,2,3].collect do |folder_index|
      folder_name = "required-#{folder_index}"
      folder_path = File.join(APP_FOLDER,'html',folder_name)
      Dir["#{folder_path}/**/*.{html,htm}"].collect do |fpath|
        File.read(fpath)
      end.join("\n")
    end.join("\n")
  end

  # 
  # {String} Toutes les balises CSS pour les styles
  # 
  def _sass_all
    main_css_path   = File.join(APP_FOLDER,'css','main.css')
    main_sass_file  = File.join(APP_FOLDER,'css','_sass','main.sass')

    File.delete(main_css_path) if File.exist?(main_css_path)

    data_compilation = { line_comments: false, style: :compressed }
    Sass.compile_file( main_sass_file, main_css_path , data_compilation)

  end

  # 
  # {String} Toutes les balises pour les JS
  # 
  def _all_javascript
    [1,2,3].collect do |folder_index|
      folder_name = "required-#{folder_index}"
      folder_path = File.join(APP_FOLDER,'js',folder_name)
      defer_mark = folder_index > 1 ? ' defer' : ''
      Dir["#{folder_path}/**/*.js"].collect do |fpath|
        relative_path = fpath.sub(/^#{APP_FOLDER}\//,'')
        "<script type=\"text/javascript\" src=\"#{relative_path}\"#{defer_mark}></script>"
      end.join
    end.join
  end

  # 
  # {Site} Instance du site
  # 
  def site
    @site ||= Site.new
  end


end #/App