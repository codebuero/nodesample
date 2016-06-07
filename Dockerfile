FROM andirotter/mininode:0.1.0

WORKDIR /opt/nodesample		

# Bundle app source
COPY ./index.js ./package.json /opt/nodesample/

# Install app dependencies
RUN npm install --production

EXPOSE  3000
CMD ["node","/opt/nodesample/index.js"]
