# Groups Controller
# Routes: index, new, create, edit, update, destroy
class GroupsController < ApplicationController
  before_action :logged_in_user
  after_action :verify_authorized

  def index
    @groups = Group.where(teacher: current_user)
    @groups = Group.all if current_user.admin?
    authorize Group
  end

  def new
    @group = Group.new
    authorize @group
  end

  def show
    @group = Group.find(params[:id])
    @enrollments = @group.enrollments
    authorize @group
  end

  def create
    @group = Group.new(course_params)
    authorize @group
    if @group.save
      flash[:success] = 'Group created successfully'
      redirect_to groups_path
    else
      render 'new'
    end
  end

  def edit
    @group = Group.find(params[:id])
    authorize @group
  end

  def update
    @group = Group.find(params[:id])
    authorize @group
    if @group.update_attributes(group_params)
      flash[:success] = 'Group updated successfully'
      redirect_to groups_path
    else
      render 'edit'
    end
  end

  def destroy
    group = Group.find(params[:id])
    authorize group
    group.destroy
    flash[:success] = 'Group deleted successfully'
    redirect_to groups_path
  end

  private

  def course_params
    params.require(:group).permit(:name, :period, :teacher_id, :course_id)
  end
end
