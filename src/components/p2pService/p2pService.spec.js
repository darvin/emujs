describe( 'p2pService', function() {
  var $document;

  beforeEach( module( 'p2pService' ) );

  beforeEach( inject( function( _p2pService_ ) {
    p2pService = _p2pService_;
  }));

  

  it( 'should talk to each other in pairs', inject( function() {
    var onReceived1 = jasmine.createSpy(),
        onReceived2 = jasmine.createSpy(),
        onConnected1 = jasmine.createSpy();
    var peer1, peer2;


    runs(function(){
      peer1 = p2pService.createClient("pairPeer1", {
        onReceived:onReceived1,
        onConnected:onConnected1
      }),
      peer2 = p2pService.createClient("pairPeer2", {onReceived:onReceived2});

      peer2.connect("pairPeer1");
    });
    waits(1000);
    runs(function(){

      expect(onConnected1).toHaveBeenCalledWith("pairPeer2");

      peer1.send({some:"dataFromPeer1"});
      peer2.send(["dataFromPeer2"]);
    });
    waits(300);
    runs(function(){  
      expect(onReceived2).toHaveBeenCalledWith("pairPeer1",{some:"dataFromPeer1"});
      expect(onReceived1).toHaveBeenCalledWith("pairPeer2",["dataFromPeer2"]);
      expect(onReceived1.callCount).toBe(1);
      expect(onReceived2.callCount).toBe(1);
    });
  }));

  it( 'should talk to each other in groups', inject( function() {
    var onReceived1 = jasmine.createSpy("onReceived1"),
        onReceived2 = jasmine.createSpy("onReceived2"),
        onReceived3 = jasmine.createSpy("onReceived3"),
        onConnected1 = jasmine.createSpy("onConnected1"),
        onConnected2 = jasmine.createSpy("onConnected2"),
        onConnected3 = jasmine.createSpy("onConnected3");
    var peer1, peer2;


    runs(function(){
      peer1 = p2pService.createClient("groupPeer1", {
        onReceived:onReceived1,
        onConnected:onConnected1
      }),
      peer2 = p2pService.createClient("groupPeer2", {
        onReceived:onReceived2,
        onConnected:onConnected2});
      peer3 = p2pService.createClient("groupPeer3", {
        onReceived:onReceived3,
        onConnected:onConnected3});

      peer2.connect("groupPeer1");
      peer3.connect("groupPeer1");
    });
    waits(1000);
    runs(function(){

      expect(onConnected1).toHaveBeenCalledWith("groupPeer2");
      expect(onConnected1).toHaveBeenCalledWith("groupPeer3");

      expect(onConnected2).toHaveBeenCalledWith("groupPeer1");
      expect(onConnected2).toHaveBeenCalledWith("groupPeer3");

      expect(onConnected3).toHaveBeenCalledWith("groupPeer2");  
      expect(onConnected3).toHaveBeenCalledWith("groupPeer1");


      peer1.send({some:"dataFromPeer1"});
    });
    waits(300);
    runs(function(){  
      expect(onReceived2).toHaveBeenCalledWith("groupPeer1",{some:"dataFromPeer1"});
      expect(onReceived3).toHaveBeenCalledWith("groupPeer1",{some:"dataFromPeer1"});
      expect(onReceived2.callCount).toBe(1);
      expect(onReceived3.callCount).toBe(1);
      expect(onReceived1.callCount).toBe(0);
    });

    runs(function(){
      peer2.send(["dataFromPeer2"]);
    });
    waits(300);
    runs(function(){  
      expect(onReceived1).toHaveBeenCalledWith("groupPeer2",["dataFromPeer2"]);
      expect(onReceived1.callCount).toBe(1);
      expect(onReceived3).toHaveBeenCalledWith("groupPeer2",["dataFromPeer2"]);
      expect(onReceived3.callCount).toBe(2);


    });
    var peer4, onReceived4 = jasmine.createSpy("onReceived4");
    runs(function(){
      peer4 = p2pService.createClient("groupPeer4", {onReceived:onReceived4});
      peer4.connect("groupPeer1");
    });
    waits(3000);
    runs(function(){  
      peer4.send(["dataFromPeer4"]);
    });
    waits(300);
    runs(function(){  
      expect(onReceived1).toHaveBeenCalledWith("groupPeer4",["dataFromPeer4"]);
      expect(onReceived1.callCount).toBe(2);
      expect(onReceived3).toHaveBeenCalledWith("groupPeer4",["dataFromPeer4"]);
      expect(onReceived3.callCount).toBe(3);
      expect(onReceived2).toHaveBeenCalledWith("groupPeer4",["dataFromPeer4"]);
      expect(onReceived2.callCount).toBe(2);
    });

    runs(function(){  
      peer1.send(["1"]);
      peer2.send(["2"]);
      peer3.send(["3"]);
    });
    waits(300);
    runs(function(){  
      expect(onReceived4).toHaveBeenCalledWith("groupPeer1",["1"]);
      expect(onReceived4).toHaveBeenCalledWith("groupPeer2",["2"]);
      expect(onReceived4).toHaveBeenCalledWith("groupPeer3",["3"]);
      expect(onReceived4.callCount).toBe(3);
    });



  }));

});

