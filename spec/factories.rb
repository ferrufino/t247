# Encoding: utf-8 #

FactoryGirl.define do

  factory :user do
    name 'John'
    lastname 'Doe'
    sequence(:registration_number) { |n| "A000#{n}" }
    sequence(:email) { |n| "A000#{n}@itesm.mx" }
    password '123456'
    admin true
    teacher false
  end

  factory :course do
    key 'TC0001'
    name 'Course 101'
  end
end
