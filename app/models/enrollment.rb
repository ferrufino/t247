# Model Enrollment
# Table groups
# Fields     id:integer, user_id:integer, group_id:integer, created_at:datetime,
#            updated_at:datetime
class Enrollment < ActiveRecord::Base
  belongs_to :user
  belongs_to :group

  validates :user, presence: true
  validates :group, presence: true
end
