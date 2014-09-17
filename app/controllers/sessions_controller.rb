# Sessions Conroller
class SessionsController < ApplicationController
  def new
    @title = "Sign in"
  end

  def create
    user = User.find_by(registration_number: params[:session][:registration_number])
    if user && user.authenticate(params[:session][:password])
      session[:user_id] = user.id
      flash.now[:notice] = 'Success'
      redirect_to root_path
      puts '11111111111111111111111111111'
    else
      puts '************************************************'
      flash.now[:danger] = 'Invalid'
      render 'new'
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url, notice: 'Logged out!'
  end
end
