# ubuntu base version
FROM ubuntu:14.04

# install C building/compiling tools
RUN sudo apt-get update
RUN sudo apt-get install -y build-essential

# install C++
RUN sudo apt-get install -y g++

# install PPA support
RUN sudo apt-get install -y python-software-properties
RUN sudo apt-get install -y software-properties-common

# Install Java.
RUN \
  echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | debconf-set-selections && \
  add-apt-repository -y ppa:webupd8team/java && \
  apt-get update && \
  apt-get install -y oracle-java8-installer && \
  rm -rf /var/lib/apt/lists/* && \
  rm -rf /var/cache/oracle-jdk8-installer

# Define commonly used JAVA_HOME variable
ENV JAVA_HOME /usr/lib/jvm/java-8-oracle

# Copiar archivo del script timeout al contenedor
ADD timeout/timeout /etc/timeout.pl
RUN sudo chmod a+x /etc/timeout.pl
