# frozen_string_literal: true

module Rack

  class AppDispatcher
    def initialize(app)
      @app = app
    end

    def call(env)
      @app.call(env)
    end
  end#/AppDispatcher

end #/module Rack