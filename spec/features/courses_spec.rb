require 'rails_helper'

feature 'Courses' do
  before(:each) do
    @user = create :user
    visit login_path
    fill_in 'Registration number', with: @user.registration_number
    fill_in 'Password', with: @user.password
    click_on 'Log In'
  end

  scenario 'Show courses list' do
    course = create :course
    visit courses_path
    expect(page).to have_content course.name
  end

  scenario 'Create new course' do
    visit new_course_path

    fill_in 'Key', with: 'TC0001'
    fill_in 'Name', with: 'Test Course'

    click_on 'Create Course'
    expect(page).to have_content 'Course created successfully'
  end

  scenario 'Edit existing course' do
    course = create :course
    visit edit_course_path(course)
    fill_in 'Name', with: 'Test Course 2'

    click_on 'Update Course'
    expect(page).to have_content 'Course updated successfully'
  end

  scenario 'Delete existing Course' do
    course = create :course, name: 'Course ToBeDestroyed'
    visit courses_path
    click_on 'Delete'

    expect(page).to have_content 'Course deleted successfully'
    expect(page).not_to have_content course.name
  end
end
