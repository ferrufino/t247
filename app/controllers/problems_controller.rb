# Problems Controller
# Routes: index, new, create, edit, update, destroy
class ProblemsController < ApplicationController
  before_action :logged_in_user
  after_action :verify_authorized

  def index
    @problems = Problem.all
    authorize Problem
  end

  def new
    @problem = Problem.new
    authorize @problem
  end

  def create
    @problem = Problem.new(problem_params)
    authorize @problem
    if @problem.save
      flash[:success] = 'Problem created successfully'
      redirect_to problems_path
    else
      render 'new'
    end
  end

  def show
    @problem = Problem.find(params[:id])
    authorize @problem
  end

  def edit
    @problem = Problem.find(params[:id])
    authorize @problem
  end

  def update
    @problem = Problem.find(params[:id])
    authorize @problem
    if @problem.update_attributes(problem_params)
      flash[:success] = 'Problem updated successfully'
      redirect_to problems_path
    else
      render 'edit'
    end
  end

  def destroy
    problem = Problem.find(params[:id])
    authorize problem
    problem.destroy
    flash[:success] = 'Problem deleted successfully'
    redirect_to problems_path
  end

  private

  def problem_params
    params.require(:problem).permit(:name, :kind, :difficulty, :description,
                                    :main, :method, :active)
  end
end
