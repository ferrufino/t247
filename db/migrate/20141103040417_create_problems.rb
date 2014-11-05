class CreateProblems < ActiveRecord::Migration
  def change
    create_table :problems do |t|
      t.integer :type
      t.string :name
      t.text :description
      t.boolean :active
      t.integer :difficulty
      t.text :main
      t.text :method

      t.timestamps
    end
  end
end
