function main(params) {
	return { 
	    // return inputs
        passSecDelayOut: params.passSecDelay,
        securityDelayOut: params.securityDelay,
        securityGateDelayOut: params.securityGateDelay,

	    // return outputs
	    delayPublic: 100
	};
}
