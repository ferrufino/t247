# Encoding: utf-8 #

FactoryGirl.define do

  factory :user do
    name 'John'
    lastname 'Doe'
    registration_number 'A001'
    email 'A001@itesm.mx'
    admin false
    teacher false
  end
end
