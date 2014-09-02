class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :registration_number
      t.string :email
      t.string :name
      t.string :lastname
      t.boolean :admin
      t.boolean :teacher

      t.timestamps
    end
  end
end
