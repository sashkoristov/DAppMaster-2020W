function main(params) {
	return { 
	    // return inputs
        delayRestrictedOut: params.delayRestricted,
        delayPublicOut: params.delayPublic,
        securityGateDelayOut: params.securityGateDelay,

	    // return outputs
	    avgTimePublic: 100,
	    avgTimeRestricted: 200
	};
}