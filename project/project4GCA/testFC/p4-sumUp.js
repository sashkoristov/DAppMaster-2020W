function main(params) {
    delay = params.area * 100 + 50;
	return { 
	    // return inputs
        passSecDelayOut: params.passSecDelay,
        securityDelayOut: params.securityDelay,
        securityGateDelayOut: params.securityGateDelay,

	    // return outputs
	    delayArea: "{\n\"area\":" + params.area + ",\n\"delay\":"+ delay + ",\n}"
	};
}
