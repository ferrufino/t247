# Model Group
# Table groups
# Fields     id:integer, name:string, period:string, teacher_id:integer,
#            course_id:integer, created_at:datetime, updated_at:datetime
class Group < ActiveRecord::Base
  belongs_to :teacher, class_name: 'User'
  belongs_to :course
  has_many :users, through: :enrollments

  validates :name, presence: true
  validates :period, presence: true
  validates :teacher, presence: true
end
