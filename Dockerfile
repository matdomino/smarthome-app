FROM openjdk:11

RUN \
    apt-get install -y wget unzip &&\
    wget --content-disposition https://github.com/hivemq/hivemq-community-edition/releases/download/2024.3/hivemq-ce-2024.3.zip &&\
    unzip hivemq-*.zip -d /opt/ &&\
    rm -f hivemq-*.zip &&\
    mv /opt/hivemq-* /opt/hivemq

WORKDIR /opt/hivemq

ENV HIVEMQ_HOME /opt/hivemq

COPY mqtt-backend/config.xml /opt/hivemq/conf/config.xml

EXPOSE 1883
EXPOSE 8000

CMD ["/opt/hivemq/bin/run.sh"]