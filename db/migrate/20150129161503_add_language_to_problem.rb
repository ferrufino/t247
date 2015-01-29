class AddLanguageToProblem < ActiveRecord::Migration
  def change
    add_column :problems, :language, :string
  end
end
