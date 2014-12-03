# Model Problem
# Table problems
# Fields         kind:integer, name:string, description:text, active:boolean,
#                difficulty:integer, main:text, method:text, created_at:datetime
#                updated_at:datetime,
class Problem < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true
  validates :kind, presence: true
  validates :description, presence: true

  has_many :cases
  accepts_nested_attributes_for :cases
end
