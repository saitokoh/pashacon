class Api::V1::ApplicationController < ApplicationController
  include DeviseTokenAuth::Concerns::SetUserByToken
  skip_before_action :verify_authenticity_token
  before_action :authenticate_api_v1_user!
  before_action :set_current_user

  private
    def set_current_user
      @current_user = current_api_v1_user
    end
end
