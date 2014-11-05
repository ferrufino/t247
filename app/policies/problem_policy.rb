# Problem access policy
class ProblemPolicy < ApplicationPolicy
  def index?
    user.admin? || user.teacher?
  end

  def new?
    user.admin?
  end

  def create?
    user.admin?
  end

  def show?
    user.admin? || user.teacher?
  end

  def edit?
    user.admin?
  end

  def update?
    user.admin?
  end

  def destroy?
    user.admin?
  end
end
