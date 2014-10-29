# Model Course
# Table courses
# Fields    id:integer, key:string, name:string, created_at:datetime,
#           updated_at:datetime
class Course < ActiveRecord::Base
  validates :key, presence: true
  validates :name, presence: true
end
