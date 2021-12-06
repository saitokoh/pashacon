class Api::V1::Auth::PasswordsController < DeviseTokenAuth::PasswordsController
  skip_before_action :verify_authenticity_token
end
