class CreateCases < ActiveRecord::Migration
  def change
    create_table :cases do |t|
      t.time :time_limit
      t.text :input
      t.text :output
      t.string :feedback
      t.float :memory_limit
      t.integer :number
      t.integer :problem_id

      t.timestamps
    end
  end
end
