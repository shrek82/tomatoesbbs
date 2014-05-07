class CreateManagers < ActiveRecord::Migration
  def change
    create_table :managers do |t|
      t.string   "name"
      t.string   "email"
      t.string   "password"
      t.datetime "login_at"
      t.string   "role"

      t.timestamps
    end
  end
end
