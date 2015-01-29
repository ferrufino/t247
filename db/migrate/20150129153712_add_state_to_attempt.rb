class AddStateToAttempt < ActiveRecord::Migration
  def change
    add_column :attempts, :state, :string
  end
end
