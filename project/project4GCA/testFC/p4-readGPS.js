function main(params) {
	return { 
	    // return inputs
        passengerIDsOut: params.passengerIDs,
        gpsGateOut: params.gpsGate,
        secGateDelayOut: params.secGateDelay,
        securityDelayOut: params.securityDelay,
        securityGPSOut: params.securityGPS,

	    // return outputs
	    passengerGPS: "DDP MMP SSP",
	    area: 1 // public -> then
	};
}