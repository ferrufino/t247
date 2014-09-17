class StaticPagesController < ApplicationController
  
  def welcome
    flash[:danger] = 'Invalid'
    redirect_to login_path unless current_user
  end

  def help
  end
end