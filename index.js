const  events = require('events')
	, schedule = require('node-schedule') 
	, ping = require('ping')
	;
var eventEmitter = new events.EventEmitter();

var loginData;
var pingJob=false;
var hosts =[];

var isHouseEmpty="unknown";
var wasHouseEmpty="unknown";


function init(ldata){
	loginData=ldata;
	hosts =[];
	for (host in loginData){
		hosts.push({name:host, ip:ldata[host].ip});
	};
};
function launch(){
	if(typeof(pingJob.cancel)==="function"){
		pingJob.cancel();
		pingJob=false;
	}
	if(pingJob==false){
		pingHost();
		pingJob =  schedule.scheduleJob("*/30 * * * * *",function(){
			pingHost();		
		});
	};
};
function cancel(){
	if(pingJob!=false){
		pingJob.cancel();
	};
	pingJob=false;
	for (user in loginData){
		loginData[user].isInHouse="unknown";
		loginData[user].wasInHouse="unknown";
		loginData[user].was2InHouse="unknown";
		eventEmitter.emit("value changed",user,"unknown");
	};
	isHouseEmpty="unknown";
	eventEmitter.emit("value changed","houseOccupied","unknown");
};
function pingHost(){
	var t=new Date();
	hosts.forEach(function(host){
		ping.sys.probe(host.ip, function(isAlive){
			loginData[host.name].was2InHouse=loginData[host.name].wasInHouse
			loginData[host.name].wasInHouse=loginData[host.name].isInHouse
			loginData[host.name].isInHouse=isAlive;
			eventEmitter.emit("value changed",host.name,isAlive);
			wasHouseEmpty=isHouseEmpty;
			isHouseEmpty=HouseEmpty();
			if (loginData[host.name].was2InHouse==false && loginData[host.name].wasInHouse==false && loginData[host.name].isInHouse==true){
				eventEmitter.emit("new log","INFO",host.name + " est entrée dans la maison");
					if (wasHouseEmpty==true){
						eventEmitter.emit("house entry");
					};
					
			};
			if (loginData[host.name].was2InHouse==true && loginData[host.name].wasInHouse==false && loginData[host.name].isInHouse==false){
				eventEmitter.emit("new log","INFO",host.name + " a quitté la maison");
				
				if (isHouseEmpty==true){
					eventEmitter.emit("house leave");
				};
			};	
		});
		
	});			
};
function HouseEmpty(){
	var inside=0;
	var outside=0;
	var unknown=0;
	var houseOccupied;
	for (user in loginData){
		if (loginData[user].isInHouse==true){
			inside=inside+1;
		} else if(loginData[user].isInHouse==false && (loginData[user].wasInHouse==false || loginData[user].wasInHouse=="unknown")){
			outside=outside+1;
		}else {
			unknown=unknown+1;
		};
	};
	if (inside==0 && unknown==0){
		houseOccupied=false;
	}else if(inside>0){
		houseOccupied=true;
	} else {
		houseOccupied="unknown";
	};
	eventEmitter.emit("value changed","houseOccupied",houseOccupied);
	return !houseOccupied;
};
	
function on(event,cb){
	eventEmitter.on(event,cb);
};

exports.on = on;
exports.init = init;
exports.cancel = cancel;
exports.launch = launch;
exports.pingHost = pingHost;
