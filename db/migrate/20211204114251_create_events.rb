class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.references :owner_user, foreign_key: {to_table: :users}
      t.string :name, null: false
      t.string :token, null: false
      t.integer :event_status_id, null: false, default: 1
      t.text :description

      t.timestamps
    end
  end
end
