class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string   "username"
      t.string   "password"
      t.string   "email"
      t.datetime "reg_date"
      t.datetime "login_date"
      t.string   "avatar_path"
      t.integer  "point"
      t.string   "memo"
      t.string   "signatures"

      t.timestamps
    end
  end
end
