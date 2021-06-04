# frozen_string_litteral: true
# encoding: UTF-8

begin
  path = File.join(APP_FOLDER,'html', Ajax.param(:rpath))
  path << '.htm' unless File.exist?(path)
  path << 'l' unless File.exist?(path)
  raise "Impossible de trouver la brique #{Ajax.param(:rpath)}" unless File.exist?(path)
  # puts "La brique existe : #{path.inspect}"
  Ajax << { brique: File.read(path).force_encoding('utf-8') }
rescue Exception => e
  Ajax.error(e)
end
