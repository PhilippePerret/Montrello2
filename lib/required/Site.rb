# frozen_string_litteral: true
require 'yaml'

class Site

def title
  @title ||= data[:title]
end

def port
  @port ||= data[:port]
end

private
  def data
    @data ||= YAML.load_file(site_config_file)  
  end

  def site_config_file
    @site_config_file ||= File.join(APP_FOLDER,'site.yaml')
  end
end