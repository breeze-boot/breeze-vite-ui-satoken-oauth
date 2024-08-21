# 基础镜像
FROM nginx:1.27
# author
MAINTAINER breeze

# 创建目录
RUN mkdir -p /usr/local/breeze/breeze-ui

# 指定路径
WORKDIR /usr/local/breeze

# 复制html文件到路径
COPY ./dist /usr/local/breeze/breeze-ui

RUN rm /etc/nginx/conf.d/default.conf

# 复制conf文件到路径
COPY ./docker/nginx/conf.d /etc/nginx/conf.d

RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone
