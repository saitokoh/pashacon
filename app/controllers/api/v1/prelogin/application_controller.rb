class Api::V1::Prelogin::ApplicationController < ApplicationController
  skip_before_action :verify_authenticity_token

end
