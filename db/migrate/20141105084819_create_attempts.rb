class CreateAttempts < ActiveRecord::Migration
  def change
    create_table :attempts do |t|
      t.text :code
      t.integer :grade
      t.string :feedback
      t.integer :result
      t.integer :user_id
      t.integer :problem_id

      t.timestamps
    end
  end
end
