require 'rails_helper'

describe User do
  it { should validate_presence_of :registration_number }
  it { should validate_presence_of :name }
  it { should validate_presence_of :lastname }
  it { should validate_presence_of :email }
  it { should validate_presence_of :password }
  it { should have_secure_password }

end
