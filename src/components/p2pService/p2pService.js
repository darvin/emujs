angular.module( 'p2pService', [])

.factory( 'p2pService', function (  ) {
  var COMMAND_PREFIX = "_com",
      COMMAND_KNOWN_PEERS = "known";
  var p2pService = {
    createClient:function(clientId, opts) {
      var defaultOpts = {
        onConnected: function(peerId) {
          console.log("connected to peer: "+peerId);
        },
        onReceived: function(peerId, data) {
          console.log("received from peer "+peerId+ " :"+data);
        }
      };

      angular.forEach(defaultOpts, function(value, key) {
        if (!opts[key]) {
          opts[key] = value;
        }
      });

      var peer = new Peer(clientId, 
        {
        key: 'qbxxtma1ws7qr529',
        host:"0.peerjs.com",
        port:"9000"
      }
        /*{host: 'localhost', port: 9000}*/
      );

      var lazySend = function(conn, data) {
        if (conn.open) {
          conn.send(data);
        } else {
          var sendOnOpen = function() {
            conn.send(data);
            conn.off("open", sendOnOpen);
          };
          conn.on("open", sendOnOpen);
        }
      };

      var connections = {};
      var getKnownPeersForConn = function(conn) {
        return Object.keys(connections).filter(function(peerId){return conn.peer!=peerId;});
      };

      var connect = function(peerId) {
        var conn = peer.connect(peerId);
        conn.on('data', onReceivedForConn(conn));
        connections[peerId] = conn;
        conn.on("open", function(){
          opts.onConnected(conn.peer);

        });

      };  
      var connectToUnknownPeers = function(knownPeers) {
        angular.forEach(knownPeers, function(peerId){
          if (!connections[peerId]) {
            console.error("connecting "+peer.id+ " to "+peerId);
            connect(peerId);
          }
        });
      };
      var processCommand = function(command, data) {
        switch(command){
          case COMMAND_KNOWN_PEERS:
            if (data.length>0) {
              connectToUnknownPeers(data);
            }
            break;
        }
      };
      var onReceivedForConn = function(conn){
        return function(data) {
          if (data instanceof Array && data[0]==COMMAND_PREFIX) {
            processCommand(data[1], data[2]);
          } else{
            opts.onReceived(conn.peer, data);

          }
        };

      };

      peer.on('connection', function(conn) {
        connections[conn.peer] = conn;
        conn.on('data', onReceivedForConn(conn));

        opts.onConnected(conn.peer);
        lazySend(conn, [COMMAND_PREFIX, COMMAND_KNOWN_PEERS, getKnownPeersForConn(conn)]);

      });

      return {
        connect: connect,
        send: function(data) {
          angular.forEach(connections, function(conn, peerId){
            lazySend(conn, data);
          });
        }
      };


    }
  };

  return p2pService;
});