# Model Problem
# Table problems
# Fields         time_limit:time, input:text, output:text, feedback:string,
#                memory_limit:float, number:integer problem_id:integer
class Case < ActiveRecord::Base
  belongs_to :problem, inverse_of: :cases

  validates :time_limit, presence: true
  validates :input, presence: true
  validates :output, presence: true
  # validates :feedback, presence: true
  validates :memory_limit, presence: true
  validates :number, presence: true
  validates :problem, presence: true
end
