# Sessions Conroller
class SessionsController < ApplicationController
  def new
    @title = "Sign in"
  end

  def create
    user = User.find_by(registration_number: params[:session][:registration_number])
    if user && user.authenticate(params[:session][:password])
      log_in user
      remember user
      flash[:success] = 'Succesfully logged in'
      redirect_to root_path
      puts '11111111111111111111111111111'
    else
      puts '************************************************'
      flash.now[:danger] = 'Invalid'
      render 'new'
    end
  end

  def destroy
    forget(current_user)
    session.delete(:user_id)
    @current_user = nil
    flash[:info] = 'Logged out'
    redirect_to root_url
  end
end
