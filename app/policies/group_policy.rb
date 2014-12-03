# Group access policy
class GroupPolicy < ApplicationPolicy
  def index?
    user.admin? || user.teacher?
  end

  def new?
    user.admin?
  end

  def create?
    user.admin?
  end

  def edit?
    user.admin? || user.teacher?
  end

  def update?
    user.admin? || user.teacher?
  end

  def destroy?
    user.admin?
  end
end
