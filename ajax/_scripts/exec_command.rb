# encoding: UTF-8
# frozen_string_literal: true
=begin

	Script qui marche de paire avec Console.js et 
	App.exec_console_command pour exécuter des commandes en console,
	commandes qui peuvent souvent s'exprimer en un seul mot. Inauguré
	pour le mot 'backup' pour produire un backup officiel des données.

=end

require_relative 'lib/Objet'

command = Ajax.param(:command)

if command.nil?
	raise "+command+ n'est pas défini. Je ne peux pas procéder à la commande."
end

msg = nil
case command
when 'official_backup'
	# => Produire un backup officiel des données
	require_relative 'lib/commands/backup.rb'
	OfficialBackups.produce_official_backup
when 'retrieve_official_backup'
	# => Revenir au dernier backup officiel des données
	require_relative 'lib/commands/backup.rb'
	OfficialBackups.retrieve_official_backup
else
	Ajax << {error: "Je ne sais pas quoi faire de la commande '#{command}'…"}
end
