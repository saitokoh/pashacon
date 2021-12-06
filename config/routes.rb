Rails.application.routes.draw do

  namespace :api, {format: :json} do
    namespace :v1 do
      mount_devise_token_auth_for 'User', at: 'auth', controllers: {
        passwords:          'api/v1/auth/passwords',
        registrations:      'api/v1/auth/registrations',
        sessions:           'api/v1/auth/sessions',
        token_validations:  'api/v1/auth/token_validations'
      }

      get 'home' => 'main#info'
      get 'events' => 'events#get_joined_events'
      get 'event/ownerEvents' => 'events#get_owner_events'
      post 'event/register' => 'events#register'
      get 'event/:event_id' => 'events#show'
      post 'event/:event_id/post' => 'posts#post'
      get 'post/:post_id/comments' => 'comments#get_asc'
      post 'post/:post_id/comment/register' => 'comments#register'

      namespace :prelogin do
        get 'event/:token' => 'events#get_for_invite'
      end
    end
  end
  
end
