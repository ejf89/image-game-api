class CreateScoreBoards < ActiveRecord::Migration[5.1]
  def change
    create_table :score_boards do |t|
      t.integer :score
      t.string :initials

      t.timestamps
    end
  end
end
