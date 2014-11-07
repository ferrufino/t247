require 'rails_helper'

feature 'Problems' do
  before(:each) do
    @user = create :user
    visit login_path
    fill_in 'Registration number', with: @user.registration_number
    fill_in 'Password', with: @user.password
    click_on 'Log In'
  end

  scenario 'Show problems list' do
    problem = create :problem
    visit problems_path
    expect(page).to have_content problem.name
  end

  scenario 'Create new problem' do
    visit new_problem_path

    # click_on 'Type 2'
    fill_in 'Difficulty', with: '1'
    fill_in 'Name', with: 'Test problem'
    fill_in 'Description', with: 'This is a description'
    fill_in 'Main', with: 'Test code'

    click_on 'Create Problem'
    expect(page).to have_content 'Problem created successfully'
  end

  scenario 'Edit existing problem' do
    problem = create :problem
    visit edit_problem_path(problem)
    fill_in 'Name', with: 'Test problem 2'

    click_on 'Update Problem'
    expect(page).to have_content 'Problem updated successfully'
  end

  scenario 'Delete existing problem' do
    problem = create :problem, name: 'Problem ToBeDestroyed'
    visit problems_path
    click_on 'Delete'

    expect(page).to have_content 'Problem deleted successfully'
    expect(page).not_to have_content problem.name
  end
end
