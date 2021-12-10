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
  has_many :votes

  # イベントに参加する
  def join_event(event)
    user_events.build(event: event)
    save!
  end

  # 投票処理
  def vote(post)
    votes.build(post: post)
    save
  end

  # 投票キャンセル処理
  def cancel_vote(post)
    vote = votes.where(post: post).first
    vote.destroy
  end

  # 主催イベントかどうか
  def owner?(event)
    owner_events.include?(event)
  end
end
