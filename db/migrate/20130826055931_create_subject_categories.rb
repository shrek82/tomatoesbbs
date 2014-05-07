class CreateSubjectCategories < ActiveRecord::Migration
  def change
    create_table :subject_categories do |t|
      t.string :name, :limit => 20
      t.integer :order_num
      t.string :icon_path, :limit => 200

      t.timestamps
    end
  end
end
