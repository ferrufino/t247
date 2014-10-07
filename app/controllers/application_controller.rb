class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # before_action :logged_in_user
  protect_from_forgery with: :exception
  include SessionsHelper
  include Pundit
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  private

  def user_not_authorized
    flash[:danger] = 'You are not authorized to perform this action'
    redirect_to(request.referrer || root_path)
  end
end
