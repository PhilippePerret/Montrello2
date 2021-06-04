# frozen_string_literal: true

APP_FOLDER = File.dirname(File.dirname(__dir__))


# Pour Write
def w(msg)
  puts msg
end
# Pour Write Blue (écrire en bleu)
def wb(msg)
  puts msg.bleu
end
# Pour Write Red (écrire en rouge)
def wr(msg)
  puts msg.rouge
end
