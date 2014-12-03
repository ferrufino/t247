require 'rails_helper'

describe Case do
  it { should validate_presence_of :problem_id }
  it { should validate_presence_of :time_limit }
  it { should validate_presence_of :input }
  it { should validate_presence_of :output }
  it { should validate_presence_of :feedback }
  it { should validate_presence_of :memory_limit }
  it { should validate_presence_of :number }
end
