# to build it locally : docker build -t myimage -f Dockerfile .
# to see all local images : docker images
# to create local container : docker create myimage
# to see all local containers : docker ps -a
# to run the container locally : docker start xxx (find the name in the above command)
# to attach to the container and see the console output : docker attach --sig-proxy=false frosty_jennings (or whatever the name is)

# To use Google Build and build it and register it in the cloud :
# Before running this, you have to Publish the app to the Out folder. (Right click on the project and select Publish)
gcloud builds submit --tag gcr.io/iconomy-pushnotifications/quickstart-image .