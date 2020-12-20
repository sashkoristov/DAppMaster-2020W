function main(params) {
    areaRnd = Math.round(Math.random());
	return {
	    // return inputs
        passengerIDsOut: params.passengerIDs,
        gpsGateOut: params.gpsGate,
        secGateDelayOut: params.secGateDelay,
        securityDelayOut: params.securityDelay,
        securityGPSOut: params.securityGPS,

	    // return outputs
	    passengerGPS: "DDP MMP SSP",
	    area: areaRnd // public -> then
	};
}