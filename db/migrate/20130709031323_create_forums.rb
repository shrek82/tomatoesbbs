class CreateForums < ActiveRecord::Migration
  def change
    create_table :forums do |t|
      t.integer  "category_id"
      t.string   "name",        limit: 100
      t.string   "intro"
      t.integer  "club_id"
      t.integer  "topics_num",              default: 0
      t.integer  "order_num",               default: 999
      t.boolean  "is_systemic",             default: false
      t.string   "ico_path",    limit: 250, default: "/images/forum/default.png"

      t.timestamps
    end

    add_index "forums", ["category_id"], name: "category_idx"
    add_index "forums", ["club_id"], name: "club_idx"

  end

end
