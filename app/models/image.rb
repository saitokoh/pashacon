class Image < ApplicationRecord
  belongs_to :post

  mount_uploader :path, ImageUploader
end
