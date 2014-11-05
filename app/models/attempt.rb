# Model Attempt
# Table attempts
# Fields         code:text, grade:integer, feedback:string, result:integer,
#                user_id:integer, problem_id:integer
class Attempt < ActiveRecord::Base
  validates :code, presence: true
  validates :user, presence: true
  validates :problem, presence: true

  belongs_to :problem
  belongs_to :user
end
