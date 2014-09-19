require 'rails_helper'

feature 'Users' do
  before(:each) do
    @user = create :user
    visit login_path
    fill_in 'Registration number', with: @user.registration_number
    fill_in 'Password', with: @user.password
    click_on 'Log In'
  end

  scenario 'Show user list' do
    user = create :user
    visit users_path
    expect(page).to have_content user.registration_number
    expect(page).to have_content user.name
    expect(page).to have_content user.lastname
    expect(page).to have_content user.email
  end

  scenario 'Create new user' do
    visit new_user_path

    fill_in 'Registration number', with: 'T001'
    fill_in 'Name', with: 'Test'
    fill_in 'Last name', with: 'Tester'
    fill_in 'Email', with: 'T001@itesm.mx'

    click_on 'Create User'
    expect(page).to have_content 'User created successfully'
  end

  scenario 'Edit existing user' do
    user = create :user
    visit edit_user_path(user)
    fill_in 'Name', with: 'Test 2'

    click_on 'Update User'
    expect(page).to have_content 'User updated successfully'
  end

  scenario 'Delete existing user' do
    user = create :user, name: 'Test ToBeDestroyed'
    visit users_path
    click_on 'Delete'

    expect(page).to have_content 'User deleted successfully'
    expect(page).not_to have_content user.name
  end
end