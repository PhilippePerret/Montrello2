# frozen_string_literal: true
require 'rack'
require 'json'
require 'yaml'

APP_FOLDER = File.dirname(__dir__)

require_relative 'required/AppDispatcher'
require_relative 'required/App'
require_relative 'required/site'