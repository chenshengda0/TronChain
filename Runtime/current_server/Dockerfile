FROM node:lts

# RUN echo "deb http://archive.debian.org/debian stretch main" > /etc/apt/sources.list 
# RUN echo "deb http://archive.debian.org/debian-security stretch/updates main" >> /etc/apt/sources.list 
# RUN apt-get update && apt-get install -y wget dos2unix
RUN apt-get update && apt-get install -y wget dos2unix && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /mnt

EXPOSE 9527

CMD yarn && yarn current >> /mnt/server.log && tail -f /dev/null