FROM ruby:2.5.5

RUN rm /etc/localtime \
  && echo "Asia/Tokyo" > /etc/timezone \
  && dpkg-reconfigure -f noninteractive tzdata

RUN apt-get update && \
  apt-get install -y --no-install-recommends\
  nodejs  \
  build-essential  \
  default-mysql-client \
  libpq-dev

RUN mkdir -p /var/www/pashacon
ENV APP_ROOT /var/www/pashacon

WORKDIR $APP_ROOT

COPY ./Gemfile $APP_ROOT/Gemfile
COPY ./Gemfile.lock $APP_ROOT/Gemfile.lock

RUN echo 'alias ll="ls -la"' >> ~/.bashrc

# railsの準備
RUN gem install bundler
RUN bundle install

COPY ./ $APP_ROOT

# 初期処理実行
CMD ["bash", "./init.sh"]