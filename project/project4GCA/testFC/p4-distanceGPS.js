function main(params) {
	return { 
	    // return inputs
        gps1Out: params.gps1,
        gps2Out: params.gps2,
        newGateGPSOut: params.newGateGPS,
        securityGPSOut: params.securityGPS,

	    // return outputs
	    delay: 5
	};
}