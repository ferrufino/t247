require 'rails_helper'

RSpec.describe Enrollment do
  it { should belong_to :user }
  it { should belong_to :group }
  it { should validate_presence_of :group }
  it { should validate_presence_of :user }
end
