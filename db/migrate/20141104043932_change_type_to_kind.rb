class ChangeTypeToKind < ActiveRecord::Migration
  def change
    rename_column :problems, :type, :kind
  end
end
