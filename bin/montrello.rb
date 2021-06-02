#!/usr/bin/env ruby
# frozen_string_litteral: true


APPFOLDER = File.dirname(__dir__)

# Ouvrir le serveur dans une nouvelle fenêtre terminal
cmd = <<-CMD
osascript <<TEXT
tell application "Terminal"
  do script "cd \\"#{APPFOLDER}\\" && puma -C run.rb"
end tell
TEXT
CMD
Thread.start { `#{cmd}` }

# 
# Si la ligne de commande contient -d, on ouvre le dossier de 
# développement
# 
if ARGV[0] == '-d'
  `open -a "Sublime Text" "#{APPFOLDER}"`
else
  puts "Tu peux ajouter '-d' pour ouvrir le dossier de développement."
end

# Ouvrir l'application dans le navigateur après deux secondes
sleep 2
`open -a Safari http://localhost:3012`

