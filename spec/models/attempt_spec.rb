require 'rails_helper'

describe Attempt do
  it { should validate_presence_of :code }
  it { should validate_presence_of :user }
  it { should validate_presence_of :problem }

  it { should belong_to :user }
  it { should belong_to :problem }
end
