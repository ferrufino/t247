# Courses Controller
# Routes: index, new, create, edit, update, destroy
class CoursesController < ApplicationController
  before_action :logged_in_user

  def index
    @courses = Course.all
  end

  def new
    @course = Course.new
  end

  def create
    @user = Course.new(user_params)
    if @course.save
      flash[:success] = 'Course created successfully'
      redirect_to courses_path
    else
      render 'new'
    end
  end

  def edit
    @course = Course.find(params[:id])
  end

  def update
    @course = Course.find(params[:id])
    if @course.update_attributes(course_params)
      flash[:success] = 'Course updated successfully'
      redirect_to courses_path
    else
      render 'edit'
    end
  end

  def destroy
    Course.find(params[:id]).destroy
    flash[:success] = 'Course deleted successfully'
    redirect_to courses_path
  end

  private

  def course_params
    params.require(:course).permit(:key, :name)
  end
end
