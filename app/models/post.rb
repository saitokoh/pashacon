class Post < ApplicationRecord
  belongs_to :user
  belongs_to :event
  has_one :image
  has_many :comments
  has_many :votes

  accepts_nested_attributes_for :image

  def save_with_image(post_params, user)
    self.description = post_params[:description]
    self.event_id = post_params[:event_id]
    self.user = user
    self.build_image
    self.image.path = post_params[:image]
    
    self.save
  end

  def vote?(user)
    votes.find{|vote| vote.user.id == user.id}.present?
  end

  def comments_order_created_at
    comments.order(:created_at)
  end
end
