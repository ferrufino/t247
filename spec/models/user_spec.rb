require 'rails_helper'

RSpec.describe User, type: :model do
  it { should validate_presence_of :registration_number }
  it { should validate_presence_of :name }
  it { should validate_presence_of :lastname }
  it { should validate_presence_of :email }

end
