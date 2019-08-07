import '@babel/polyfill/noConflict'
import server from './server'

const whitelist = [
  'renterii.renterii.now.sh',
]

const opts = {
    port: process.env.PORT || 4000,
    cors: {
      credentials: true,
      origin: function(origin, callback){
        let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
      }
    }
};

server.start({ opts }, () => {
    console.log('The server is up!')
})
