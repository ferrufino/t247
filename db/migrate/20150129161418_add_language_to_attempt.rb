class AddLanguageToAttempt < ActiveRecord::Migration
  def change
    add_column :attempts, :language, :string
  end
end
