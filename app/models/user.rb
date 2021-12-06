# frozen_string_literal: true

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  include DeviseTokenAuth::Concerns::User

  has_many :owner_events, class_name: 'Event', foreign_key: :owner_user_id
  has_many :user_events
  has_many :events, through: :user_events

  # イベントに参加する
  def join_event(event)
    user_events.build(event: event)
    save!
  end
end
