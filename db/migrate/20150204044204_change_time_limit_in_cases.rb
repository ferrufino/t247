class ChangeTimeLimitInCases < ActiveRecord::Migration
  def up
    change_column :cases, :time_limit, :float
  end

  def down
    change_column :cases, :time_limit, :time
  end
end
