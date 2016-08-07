module['exports'] = function echoHttp (hook) {
    console.log(hook.params);
    console.log(hook.req.path);
    console.log(hook.req.method);
    console.log(hook.env);
  
  	var contactlist = [
    	{name: "John", number: '203-972-7982'},
      	{name: 'Chris', number: '305-535-1342'},
		// ...
	];
  
  	var message = hook.params["text"];
  	var name = hook.params["number"];
  	var messagetype = hook.params["messagetype"];
  	var number;
  	
  	var twilioNumber = '203-989-2967';
	var retVal;
	var telnumber;
  
	var phoneno = /^(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;
  	
  	if(name.match(phoneno)) 
      	number = name;
  
	if(number != undefined){
		telnumber = "+" + number;
      
      	retVal = "<speak>Sending " + messagetype + " message, " + message + ", to, " + 
          		 "<say-as interpret-as=\"telephone\">" + name + "</say-as>" +
          		 "</speak>"
	}
  	else{
      	for(var index=0; index<contactlist.length; ++index){
          	if(contactlist[index].name.toUpperCase() === name.toUpperCase()){
              	telnumber = contactlist[index].number;
              
              	break;
            }
        }
      
      	retVal = "<speak>Sending " + messagetype + " message, " + message + ", to, " + 
					name  +
          		 "</speak>"
    }
	
	if(telnumber != undefined){
      	var client = require('twilio')('AC8161ba6c792accd4a86132512ed1131d', '83ad1b3bbf653270d42d46534e405ce7');
      
      	if(messagetype === "voice"){
          	client.makeCall(
              		{
						to:telnumber,
                    	from: twilioNumber,
                    	url: 'https://hook.io/jamesthesnake/gettwiml?text=' + encodeURIComponent(message)
                    }, function(err, responseData) {
                        console.log(err);
                        console.log(responseData); // outputs "+14506667788"

                        hook.res.end(retVal);
                   });
        }
      	else if(messagetype === "text"){
          	client.messages.create({
                	    to:telnumber,
                    	from: twilioNumber,
                    	body: message
                	}, function(err, responseData) {
	
    	                //executed when the call has been initiated.
                    	console.log(err);
                    	console.log(responseData); // outputs "+14506667788"
	
                    	hook.res.end(retVal);
                	}
            	);
        }
	}
  	else{
      	retVal = "<speak>Sorry I can't find, " + name + ", in your contact list</speak>";
      
      	hook.res.end(retVal);
  	}
};