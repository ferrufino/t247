require 'rails_helper'

feature 'Groups' do
  before(:each) do
    @user = create :user
    visit login_path
    fill_in 'Registration number', with: @user.registration_number
    fill_in 'Password', with: @user.password
    click_on 'Log In'
  end

  scenario 'Show groups list' do
    group = create :group
    visit groups_path
    expect(page).to have_content group.name
  end

  scenario 'Create new group' do
    teacher = create :teacher
    course = create :course
    visit new_group_path

    fill_in 'Name', with: 'Algoritmos.1'
    fill_in 'Period', with: 'Ago-Dic 2014'
    select course.key, from: 'Course'
    select teacher.name, from: 'Teacher'

    click_on 'Create Group'
    expect(page).to have_content 'Group created successfully'
  end

  scenario 'Edit existing group' do
    group = create :group
    visit edit_group_path(group)
    fill_in 'Name', with: 'Algoritmos.2'

    click_on 'Update Group'
    expect(page).to have_content 'Group updated successfully'
  end

  scenario 'Delete existing Group' do
    group = create :group, name: 'Group ToBeDestroyed'
    visit groups_path
    click_on 'Delete'

    expect(page).to have_content 'Group deleted successfully'
    expect(page).not_to have_content group.name
  end
end
