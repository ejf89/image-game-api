class CreateDurations < ActiveRecord::Migration[5.1]
  def change
    create_table :durations do |t|
      t.integer :image_id
      t.integer :duration

      t.timestamps
    end
  end
end
