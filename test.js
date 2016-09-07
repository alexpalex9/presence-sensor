const  ps = require('./alexPresenceSensor.js')
	;


ps.on('value changed',function(user,isinhouse){
	console.log(user + ' is alive ? :' + isinhouse); 
});
ps.on('house entry',function(){
	console.log('the house is not empty anymore');
});
ps.on('house leave',function(){
	console.log('the house is now empty');
});

ps.init({'tom':{'ip':'192.165.0.92'}});
ps.launch();