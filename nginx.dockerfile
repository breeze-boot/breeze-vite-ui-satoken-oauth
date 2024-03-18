# 基础镜像
FROM nginx:latest
# author
MAINTAINER breeze

# 创建目录
RUN mkdir -p /usr/local/breeze/breeze-ui

# 指定路径
WORKDIR /usr/local/breeze

# 复制conf文件到路径
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
# 复制html文件到路径
COPY ./dist /usr/local/breeze/breeze-ui

RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone
