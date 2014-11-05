# Attempts Controller
# Routes: index, new, create, edit, update, destroy
class AttemptsController < ApplicationController
  before_action :logged_in_user
  after_action :verify_authorized

  def index
    @attempts = Attempt.all
    @attempts = Attempt.where(user: curent_user) if current_user.role == 'Student'
    authorize Attempt
  end

  def new
    @attempt = Attempt.new
    authorize @attempt
  end

  def create
    @attempt = Attempt.new(attempt_params)
    authorize @attempt
    if @attempt.save
      flash[:success] = 'Attempt created successfully'
      redirect_to attempts_path
    else
      flash[:danger] = 'Error'
      render 'new'
    end
  end

  private

  def attempt_params
    params.require(:attempt).permit(:user_id, :problem_id, :code)
  end
end
