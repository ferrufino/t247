class AddAttachmentSourceFileToAttempts < ActiveRecord::Migration
  def self.up
    change_table :attempts do |t|
      t.attachment :source_file
    end
  end

  def self.down
    remove_attachment :attempts, :source_file
  end
end
