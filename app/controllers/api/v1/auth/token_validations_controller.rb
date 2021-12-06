class Api::V1::Auth::TokenValidationsController < DeviseTokenAuth::TokenValidationsController
  skip_before_action :verify_authenticity_token
end
