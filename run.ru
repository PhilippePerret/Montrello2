require_relative 'lib/required'

use Rack::AppDispatcher
use Rack::Static, urls: ['/css', '/js', '/img']
run App.new
