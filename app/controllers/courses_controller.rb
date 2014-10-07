# Courses Controller
# Routes: index, new, create, edit, update, destroy
class CoursesController < ApplicationController
  before_action :logged_in_user
  after_action :verify_authorized

  def index
    @courses = Course.all
    authorize Course
  end

  def new
    @course = Course.new
    authorize @course
  end

  def create
    @course = Course.new(course_params)
    authorize @course
    if @course.save
      flash[:success] = 'Course created successfully'
      redirect_to courses_path
    else
      render 'new'
    end
  end

  def edit
    @course = Course.find(params[:id])
    authorize @course
  end

  def update
    @course = Course.find(params[:id])
    authorize @course
    if @course.update_attributes(course_params)
      flash[:success] = 'Course updated successfully'
      redirect_to courses_path
    else
      render 'edit'
    end
  end

  def destroy
    course = Course.find(params[:id])
    authorize course
    course.destroy
    flash[:success] = 'Course deleted successfully'
    redirect_to courses_path
  end

  private

  def course_params
    params.require(:course).permit(:key, :name)
  end
end
