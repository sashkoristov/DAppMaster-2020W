function main(params) {
	return { 
	    // return inputs
        video: params.video,
        folderVideos: params.folderVideos,
        folderFrames: params.folderFrames,

	    // return outputs
	    numberFrames: 3,
	    frames: ['1','2','3'],
	    frames2: ['2','3','4'],
	};
}