class ApplicationController < ActionController::Base
	include DeviseTokenAuth::Concerns::SetUserByToken
	skip_before_action :verify_authenticity_token, if: :devise_controller? # APIではCSRFチェックをしない

	def fallback_index_html
    render :file => 'public/index.html'
  end
end
