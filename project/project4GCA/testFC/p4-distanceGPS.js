function main(params) {
	return { 
	    // return inputs
        gps1Out: params.gps1,
        gps2Out: params.gps2,
        newGateGPSOut: params.newGateGPS,
        securityGPSOut: params.securityGPS,

	    // return outputs
	    delay: 20,
	    delayArea: "{\n\"area\":" + params.area + ",\n\"delay\":" + 40 + ",\n}"
	};
}