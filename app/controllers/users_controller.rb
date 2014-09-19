# Users Controller
# Routes: index, new, create, edit, update, destroy
class UsersController < ApplicationController
  before_action :logged_in_user

  def index
    @users = User.all
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    @user.password = @user.registration_number
    if @user.save
      flash[:success] = 'User created successfully'
      redirect_to users_path
    else
      render 'new'
    end
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])
    if @user.update_attributes(user_params)
      flash[:success] = 'User updated successfully'
      redirect_to users_path
    else
      render 'edit'
    end
  end

  def destroy
    User.find(params[:id]).destroy
    flash[:success] = 'User deleted successfully'
    redirect_to users_path
  end

  private

  def user_params
    params.require(:user).permit(:registration_number, :name, :lastname, :email,
                                 :admin, :teacher)
  end
end
