#!/usr/bin/env puma

PORT = 3012

rackup 'run.ru'

# environment 'production'

# bind 'tcp://127.0.0.1:3012'
bind "tcp://127.0.0.1:#{PORT}"