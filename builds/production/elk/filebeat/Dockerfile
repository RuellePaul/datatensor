FROM docker.elastic.co/beats/filebeat:8.1.0

# Copy our custom configuration file
COPY filebeat.yml /usr/share/filebeat/filebeat.yml

USER root
# Create a directory to map volume with all docker log files
RUN chown -R root:filebeat /usr/share/filebeat/
RUN chmod -R go-w /usr/share/filebeat/
