# Model Attempt
# Table attempts
# Fields         code:text, grade:integer, feedback:string, result:integer,
#                user_id:integer, problem_id:integer
class Attempt < ActiveRecord::Base
  has_attached_file :source_file

  belongs_to :problem
  belongs_to :user

  validates_attachment_content_type :source_file, content_type: /\Atext/
  # validates :code, presence: true, unless: :source_file?
  validates :user, presence: true
  validates :problem, presence: true
end
