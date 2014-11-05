# Attempt access policy
class AttemptPolicy < ApplicationPolicy
  def index?
    user
  end

  def new?
    user
  end

  def create?
    user
  end
end
