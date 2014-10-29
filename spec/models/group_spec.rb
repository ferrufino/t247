require 'rails_helper'

RSpec.describe Group do
  it { should validate_presence_of :teacher_id }
  it { should validate_presence_of :name }
  it { should validate_presence_of :period }
  it { should belong_to :teacher }
  it { should have_many :users }
  
end
