module.exports = {
  availableDevices: new Array(0),  //<< -- global object to store valid IPs in
  scan: function(startIP, endIP, targetPort, interfaceName){
    var myIP=this.getIP(interfaceName);
    var cutoff=myIP.lastIndexOf(".")
    var IPPrefix = myIP.slice(0, cutoff+1);
    var net=require('net');
    someArray=new Array(0);

    var startOct=1;
    var endOct=255;

    if(startIP != ""){
	var tmps=startIP.lastIndexOf(".");
	startOct=parseInt(startIP.slice(tmps));
	}
    if(endIP != ""){
	var tmpe=startIP.lastIndexOf(".");
	endOct=parseInt(endIP.slice(tmpe));
	}

    var currOct=startOct;
    var currIP=IPPrefix+String(currOct);
    console.log("MyIP: "+myIP+" currIP:"+currIP);
    var self=this;
    while(currOct!= endOct) {
	//Attempt connection here
      if(currIP!=myIP) {
		//console.log("Trying "+currIP);
		
		var sock = new net.Socket();
		sock.test=this.availableDevices;  //<<---Attempt at passing in reference to global/local object
		sock.connect({port: targetPort, host: currIP, localAddress: myIP, localPort:40329});
		
		sock.on('connect', function(tst){
			var deviceEntry={address: this.remoteAddress, deviceType:"unknown", deviceName:"unknown" };
			var entry=self.searchDeviceList(self.availableDevices, deviceEntry);
			if(entry==-1){
				self.availableDevices.push(deviceEntry);
				self.getRemoteDeviceInfo(this.remoteAddress, self.targetPort, entry);
				}
			
			
			//this.logEntry(this.remoteAddress);
			//availableDevices.push(this.remoteAddress);
			console.log("  FOUND: "+this.remoteAddress); //<<---need to store valid IPs in global objects from here.
			});
		sock.on('error', function(e) {
			if((e.code == 'ECONNREFUSED')||(e.code== 'EHOSTUNREACH')) {
				//console.log("  "+ this.remoteAddress+":"+ targetPort +" "+ currIP+" not available: "+e.code);
				}
			else {
				console.log("General Network Error["+this.remoteAddress+"] "+ e.message);
				}
			});
		sock.on('uncaughtException', function(e){
			console.log("Something unexpected happened: "+e);
			});
		
	
		//If connection is successful, add row to output JSON
		}
		currOct++;
		currIP=IPPrefix+String(currOct);
	}
    //return this.availableDevices;
    },

   searchDeviceList: function(deviceList, deviceData) {
	for(var ctr=0; ctr<deviceList.length; ctr++) {
	  if(deviceList[ctr].address==deviceData.address) {
		return ctr;
		}
	  }
	return -1;
	},

   getRemoteDeviceInfo: function(deviceAddress, port, entry){
	//Create an HTTP connection and query the /deviceInfo service
	var deviceType;
	var deviceName;
	
	deviceType=this.getRemoteDeviceType(deviceAddress, port);
	deviceName=this.getRemoteDeviceName(deviceAddress, port);

	return {'deviceType': deviceType, 'deviceName': deviceName }
	},

   getRemoteDeviceType: function(deviceAddress, rem_port){
	var deviceType;

	var http=require('http');
	var conn=http.get("http://"+deviceAddress+":"+rem_port+"/deviceType", function(res){
		console.log("deviceType result: "+res.statusCode);
		});
	conn.on('data', function(dat){
	   bodyTxt+=dat;
	   console.log("Body:  "+bodyTxt);
	});
	

	return deviceType;
	},
   getRemoteDeviceName: function(deviceAddress, rem_port){
	var deviceName;
	
	return deviceName;
	},


   getHostName: function(){
	var os= require("os");
	return os.hostname();

	},
	
	createPreferences: function(new_deviceName, agent_ctl){
	  var ret = new Object();
	  ret.deviceName=new_deviceName;
	  ret.agents=agent_ctl;
	  //ret.pinMap=new_pinMapping;
	  
	  return ret;
	},

   getIP: function(interfaceName){
	var os= require("os");
	var ip="0.0.0.0"
	var ifaces = os.networkInterfaces();
	console.log("Getting IP for interface "+interfaceName);
	Object.keys(ifaces).forEach(function (ifname) {
		ifaces[ifname].forEach(function (iface) {
			console.log("  Checking: "+ifname+","+iface.family+","+iface.address);
			if('IPv4' == iface.family && ifname == interfaceName)
				ip = iface.address 
			});
		});
	return ip;
	},
	
	getIPInfo: function(retType){
	if(retType == null)
		retType = "html";
	// For network interface info
	var os = require('os');
	var ifaces = os.networkInterfaces();

	var o = {} // empty Object
	var key = 'ipinfo';
	o[key] = []; // empty Array, which you can push() values into
	
	var ipinfoHTML = "";
	Object.keys(ifaces).forEach(function (ifname) {
	  var alias = 0;

	  ifaces[ifname].forEach(function (iface) 
	  {
		if ('IPv4' !== iface.family || iface.internal !== false) 
		{
		  // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
		  return;
		}

		if (alias >= 1) 
		{
			// this single interface has multiple ipv4 addresses
			console.log(ifname + ':' + alias, iface.address);
			ipinfoHTML += "<li>"+ifname + ':' + alias +","+ iface.address;
			
			var data = {
				interfacename: ifname+":"+alias,
				interfaceaddress: iface.address
			};
			o[key].push(data);		  
		} 
		else 
		{
			// this interface has only one ipv4 adress
			console.log(ifname, iface.address);
			ipinfoHTML += "<li>"+ifname + ':' + iface.address;
			  
			var data = {
				interfacename: ifname,
				interfaceaddress: iface.address
			};
			o[key].push(data);		  
		}
		++alias;
	  });
	});	
	
	if(retType == "html")
		return ipinfoHTML;
	else	
		return JSON.stringify(o);
	}



}
