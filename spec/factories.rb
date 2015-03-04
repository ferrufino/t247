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

  factory :teacher, class: User do
    name 'Mr'
    lastname 'Teaches'
    sequence(:registration_number) { |n| "L000#{n}" }
    sequence(:email) { |n| "L000#{n}@itesm.mx" }
    password '123456'
    admin false
    teacher true
  end

  factory :course do
    key 'TC0001'
    name 'Course 101'
  end

  factory :group do
    name 'Algoritmos.1'
    period 'Ago-Dic 2014'
    teacher
    course
  end

  factory :problem do
    name 'Testing Problem'
    kind 2
    difficulty 1
    description 'My problem description'
    main 'Problem main function'
  end
end
