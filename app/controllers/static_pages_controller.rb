class StaticPagesController < ApplicationController
  
  def welcome
    redirect_to login_path unless current_user
  end

  def help
  end
end