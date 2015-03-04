# Model Problem
# Table problems
# Fields         kind:integer, name:string, description:text, active:boolean,
#                difficulty:integer, main:text, method:text, created_at:datetime
#                updated_at:datetime,
class Problem < ActiveRecord::Base
  has_many :cases, inverse_of: :problem

  validates :name, presence: true, uniqueness: true
  validates :kind, presence: true
  validates :description, presence: true

  accepts_nested_attributes_for :cases
end
