class CreateTopics < ActiveRecord::Migration
  def change
    create_table :topics do |t|
      t.string   "title",                  limit: 150
      t.integer  "forum_id"
      t.integer  "subject_id",             limit: 2
      t.integer  "club_id"
      t.integer  "user_id"
      t.string   "title_color",            limit: 10
      t.boolean  "is_fixed",                           default: false
      t.boolean  "is_comment",                         default: false
      t.boolean  "is_good",                            default: false
      t.boolean  "is_recommend",                       default: false
      t.integer  "hits_num",                           default: 0
      t.integer  "comments_num",                       default: 0
      t.integer  "last_comment_user_id"
      t.string   "last_comment_user_name", limit: 50
      t.datetime "last_comment_time"

      t.timestamps
    end

    add_index "topics", ["forum_id"], name: "forum_idx"
    add_index "topics", ["is_good"], name: "is_goodx"
    add_index "topics", ["subject_id"], name: "subject_idx"
    add_index "topics", ["user_id"], name: "user_idx"

  end
end
