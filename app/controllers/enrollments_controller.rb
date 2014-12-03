# Enrollments Controller
# Routes: index, new, create, edit, update, destroy
class EnrollmentsController < ApplicationController
  before_action :logged_in_user
  after_action :verify_authorized

  def index
    @enrollments = Enrollment.all
    authorize Enrollment
  end

  def new
    @enrollment = Enrollment.new
    authorize @enrollment
  end

  def create
    @enrollment = Enrollment.new(enrollment_params)
    authorize @enrollment
    if @enrollment.save
      flash[:success] = 'Enrollment created successfully'
      redirect_to new_enrollment_path
    else
      render 'new'
    end
  end

  private

  def enrollment_params
    params.require(:enrollment).permit(:user_id, :group_id)
  end
end
