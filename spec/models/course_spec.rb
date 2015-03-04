require 'rails_helper'

describe Course do
  it { should validate_presence_of :key }
  it { should validate_presence_of :name }
end
