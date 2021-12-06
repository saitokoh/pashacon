class EventStatus < ActiveHash::Base
  include ActiveHash::Enum

  enum_accessor :name

  fields :name, :display_name
  create id: 1, name: "post_accepting", display_name: "投稿受付中"
  create id: 2, name: "voting_period", display_name: "投票期間"
  create id: 99, name: "end", display_name: "終了"

end
