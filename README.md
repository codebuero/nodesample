# nodesample

Repo for hub.docker.com/r/andirotter/nodesample

## Content

A small node.js based app with a (virtual) user list and a form
to add new user. No database involved or anything else. 

## Installation

Just clone the repo and do a

```node index.js```

to find the app running on port 3000 on your localhost.

To use the docker container, make 

```docker pull andirotter/nodesample```

to fetch the latest image.  

Then do

```docker run -d --name nodesample -p 3000:3000 andirotter/nodesample```

