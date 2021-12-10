class Event < ApplicationRecord
  extend ActiveHash::Associations::ActiveRecordExtensions
  belongs_to_active_hash :event_status

  belongs_to :owner_user, class_name: "User"
  has_many :posts
  has_many :user_events


  scope :post_accepting, -> {where(event_status_id: EventStatus::POST_ACCEPTING.id)}

  def join?(user)
    user.events.include?(self)
  end

  def user_posts(user_id)
    posts.where(user_id: user_id)
  end

  def invitation_url
    Pashacon::Application.config.invitation_url + self.token
  end

  def get_posts
    self.posts.eager_load(:user, :image, :votes, comments: [:user]).order(:created_at)
  end

  def self.new(register_params, user)
    event = super(register_params)
    event.owner_user = user
    # hashを作成
    event.token = Digest::SHA256.hexdigest(event.name + Time.zone.now.to_s)

    event
  end

end
