class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # before_action :logged_in_user
  protect_from_forgery with: :exception
  include SessionsHelper
end
