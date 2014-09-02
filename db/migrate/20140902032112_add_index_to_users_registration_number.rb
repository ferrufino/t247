class AddIndexToUsersRegistrationNumber < ActiveRecord::Migration
  def change
    add_index :users, :registration_number, unique: true
  end
end
