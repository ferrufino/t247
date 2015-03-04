require 'rails_helper'

RSpec.describe Group do
  it { should validate_presence_of :teacher }
  it { should validate_presence_of :name }
  it { should validate_presence_of :period }
  it { should validate_presence_of :course }
  it { should belong_to :teacher }
  it { should belong_to :course }
  it { should have_many :users }
end
