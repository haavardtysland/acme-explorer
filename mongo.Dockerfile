# Use the official MongoDB image as the base image
FROM mongo:latest

# Set the working directory
WORKDIR /data

# Expose the MongoDB port
EXPOSE 27017

# Set the environment variables
ENV MONGO_INITDB_ROOT_USERNAME=<username>
ENV MONGO_INITDB_ROOT_PASSWORD=<password>

# Start MongoDB with the default settings
CMD ["mongod"]