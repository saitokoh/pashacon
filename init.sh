#!/bin/bash

#RAILS_ENV=development bundle exec bin/delayed_job start

# unicornで起動
# rm -f tmp/pids/unicorn.pid
# bundle exec unicorn -c /var/www/rails/mieruca-connect/config/unicorn.conf.rb -E development

# webrickで起動
#rm -f tmp/pids/server.pid
#bundle exec rails s -p 3000 -b 0.0.0.0
bash