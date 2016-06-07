NODESAMPLE_IMAGE_NAME=andirotter/nodesample
NODESAMPLE_VERSION=0.6.0


buildDockerContainer: Dockerfile
	docker --tls build --no-cache=false -t $(NODESAMPLE_IMAGE_NAME):$(NODESAMPLE_VERSION) .

pushDockerContainer: Dockerfile
	docker tag $(NODESAMPLE_IMAGE_NAME):$(NODESAMPLE_VERSION) $(NODESAMPLE_IMAGE_NAME):latest
	docker --tls push $(NODESAMPLE_IMAGE_NAME):$(NODESAMPLE_VERSION)
	docker --tls push $(NODESAMPLE_IMAGE_NAME):latest