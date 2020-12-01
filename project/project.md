
----

# Project 1: Object recognition `Storage, Recognition Service, OpenCV` (Python only, Python +Java, Python+Node.js)


You'll create a computer vision FC that intelligently detects dogs, kids (and arbitrary objects) in long streams of video.

## Introduction

### Motivation

You have a motion-sensing camera installed at your porch. When a motion is detected, the camera starts filming and stores it as separate video file to the storage.
At the end of the day you want to know when the dog or kid roamed around too far this day. You can't be bothered to look through the videos manually. 
To complicate things, the camera often activates on birds, neighbors, delivery people.

As most IoT devices, the camera does not do any preprocessing. Therefore the video files are very large. Applying computer vision to the entire videos is infeasible.

Your FC should efficiently detect at which times of the day your kid or dog appeared. It should be scalable (with number of videos) and cost-efficient (do with as few expensive tasks - Image recognition - as possible).

### Input 

A folder of videos of that day on the storage.

```
└── your-video-bucket
    ├── 1604670378.mp4
    └── 1604670406.mp4
```


### Rough steps 

* Extract frames (every 0.5 second) from the videos and store them as images to storage (AWS S3 / IBM Cloud Object Storage). 
* Between each two subsequent images, check if there is a significant delta (something happening). 
* Use AWS Rekognition to detect dogs or kids on those
* Output when either appeared on the porch that day as human sentence (string).


## MS2 (17.12.2020): Develop the FC with AFCL


Develop the preliminary FC with AFCL. 

Think about these things:

* How to group the above algorithm into functions 
* What you can do in parallel; what is independent from each other
* What information each function needs, how you best represent it (Storage ARNs/URLs, collections thereof, named fields)
* How information flows between your functions


Put together the FC using the FC editor, AFCL Java API, or the YAML editor. The main goal is to think about modularity and data flow. 

Create empty functions that just produce the data how you specified with AFCL. Run the FC with these functions with the *xAFCL* Enactment Engine.


## MS3 (07.01.2021, Homework 06): Code the functions + deploy them on across ultiple regions with a Terraform script


### Rough functions

#### Frame extractor `Storage (S3 / Object Storage)` - `Python`

This function should load a `.mp4` from the storage, extract frames (every 0.5 second) as image using OpenCV and store the images to the storage. 

Hints:
1. Make yourself familiar with OpenCV for Python and try it out on your local machine. 
1. To avoid uploading OpenCV for each function, and everytime you change them, explore other ways to get the library into your functions. 
1. Stick to a deterministic naming convention for everything you store to the storage, to avoid overwrites.


#### Delta finder `Storage` - `Python`

This function should take images from the storage and find interesting frames by doing delta detection with OpenCV on each two subsequent frames.
To get more reliable deltas, [smoothen](https://towardsdatascience.com/types-of-convolution-kernels-simplified-f040cb307c37) the images with [`filter2D`](https://pythonexamples.org/python-opencv-image-filter-convolution-cv2-filter2d/) before you compare them. 

Hints:
* Find a way to know which images are 'subsequent'.


#### Recognition and Interpretation `Storage, AWS Rekognition / IBM Visual Recognition` (Python, Java, or node.js)

This function should use a recognition cloud service to find dogs or kids in frames that Delta finder deemed interesting.
Make sure you also retain the information whether it was a dog or kid.

Hints:
* Choose an appropriate confidence threshold


#### Grouping and Output (Python, Java, or node.js)

This function should construct a human sentence that tells you when the dog or kid appeared in the shot that day. It should be [brief and relevant](https://developer.amazon.com/en-US/alexa/branding/alexa-guidelines/communication-guidelines/brand-voice). For that purpose, you will have to intelligently group by time (`'at 2pm'`), truncate if necessary (`'5 times on the afternoon'`), and so on.
Return the sentence as string.


## MS4 (21.01.2021, Homework 07)

Develop the given scheduler to schedule the FC across all function deployments.


----


# Project 2: BWA `Storage, bwa & samtools, Integrative Genomics Viewer` (Python, Java, or node.js)


You'll create a real-life FC to process Escherichia Coli DNA samples, and then investigate whether the patient can be treated with antibiotics.

## Introduction

### Motivation

You are working in a lab that frequently receives DNA samples of Ecoli bacteria from a hospital.
Ecoli can cause potentially food poisoning, for which the recommended treatment for healthy adults is to just wait it out.
However, in some cases antibiotics may be necessary.

You want to find out if this Ecoli strain could be treated with antibiotics, to then suggest a treatment for the patient.

This has to happen as fast as possible from when the sample arrives. Ecoli DNA is fairly short (4.6 million base pairs). However, samples are usually contaminated (human, bacterial DNA) so processing is hard and has to be parallelized.

Your lab uses a short-read sequencer such as [Illumina MiSeq](https://www.illumina.com/systems/sequencing-platforms/miseq.html) to read ('sequence') the [basepairs](https://en.wikipedia.org/wiki/Base_pair#Examples) of the DNA. 


### Input


```
└── your-bucket
    ├── NC_000913.3.fasta  
    └── reads
        ├── hipa7_reads_R1.fastq
        └── hipa7_reads_R2.fastq
```

* A [FASTA](https://genome.sph.umich.edu/wiki/FASTA) text file containing the entire DNA of Ecoli ('reference genome')
* A FASTQ text file (FASTA plus likelihood that reads are correct) with paired-end reads ('ABCDE' and 'EDCBA') of your Ecoli sample, obtained from the MiSeq.



### Rough steps

```sh
# Non-parallel, non-distributed
# Linux only
# Install bwa, samtools first.

bwa index NC_000913.3-hipA7.fasta
bwa aln NC_000913.3-hipA7.fasta reads/hipa7_reads_R1.fastq > aln_sa1.sai
bwa aln NC_000913.3-hipA7.fasta reads/hipa7_reads_R2.fastq > aln_sa2.sai
bwa sampe NC_000913.3-hipA7.fasta aln_sa1.sai aln_sa2.sai reads/hipa7_reads_R1.fastq reads/hipa7_reads_R2.fastq > NC_000913.3.sam
samtools sort -O sam -T sample.sort -o NC_000913.3sorted.sam NC_000913.3.sam 
samtools view -b -S NC_000913.3sorted.sam > NC_000913.3sorted.bam
samtools index NC_000913.3sorted.bam

echo "#############################################################"
echo "#                           DONE                            # "
echo "# Output: NC_000913.3sorted.bam, NC_000913.3sorted.bam.bai  # "
echo "#                                                           # "
echo "#############################################################"
```

Your distributed version should split the reference genome (`NC_000913.3-hipA7.fasta`) into smaller parts, and then parallelize the rest accordingly.


### Crash course in Bioinformatics

DNA is the source code of organisms. It is a string of the bases `A`, `T`, `G`, `C` (analogous to to `0` and `1`) that describes all traits of the organism. It is incredibly long - 2 meters and 3 billion basepairs (bits) for humans - but it is bundled up ingeniously so it fits into cells that are just 10 to 100 micrometers in diameter.
Every cell contains an entire copy of the DNA.
To see if a human has brown eyes, a bacterium is resistant to antibiotics, or a crab may develop porous shields, we can just read its DNA - given we know how to interpret it.
Of course, every organism, including twins, has slightly different DNA.

DNA readers give you many random substrings of the DNA sample, whether that is hair, skin cells, or a bacterial colony.

We usually also have a reference DNA of that organism. This is akin to the picture on a puzzle box, and gives us a rough idea how the puzzle pieces (reads) fit together.

. | notes
---|----
 `ATCGAAACTT` | reference DNA
  `??????????` | skin sample DNA
 `ATCC`, `ACT`, `AAC`, `CCAAA`, `ACTT` | reads of skin sample
 <code>ATCGAAACTT</code> (reference DNA)<br><code>ATC<b>C</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ACT&nbsp;</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AAC&nbsp;&nbsp;</code><br><code>&nbsp;&nbsp;C<b>C</b>AAA&nbsp;&nbsp;&nbsp;</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ACTT</code><br><code>ATC<b>C</b>AAACTT</code> (aligned skin sample DNA) | what bwa does
We know that a `C` mutation at the fourth<br> position leads to brown eyes. Now we <br>check for that by hand in the aligned DNA. | IGV (by hand)


### Hints

This FC is all about file management at scale. Assume that every step (`bwa index`, `bwa aln` and so on) produces new files that the next step needs.
Furthermore, the parallel section produces files with the same name. We left you a recommendation how to handle this [in Week B](#rough-functions-1).


## MS2 (17.12.2020): Develop the FC with AFCL


Develop a preliminary FC with AFCL. 

It helps to try out [`bwa`](http://manpages.ubuntu.com/manpages/bionic/man1/bwa.1.html) on your local machine. 

Think about these things:

* How to group the above algorithm into functions 
* How do you best 'keep' / 'transport' files between subsequent functions?
* Each parallel function will produce files with the same name. How do you prevent naming conflicts on the storage?
* What information each function needs, how you best represent it (file content strings, storage ARNs, collections thereof, named fields)
* How information flows between your functions

Put together the FC using the FC editor, AFCL Java API, or the YAML editor. The main goal is to think about modularity and data flow. 

Create empty functions that just produce the data how you specified with AFCL. Run the FC with these functions with the *xAFCL* Enactment Engine.


## MS3 (07.01.2021, Homework 06): Code the functions + deploy them on across ultiple regions with a Terraform script

Make sure you can run the steps on your Laptop / PC.

### Rough functions

Serverless functions always see a fresh filesystem, but for `bwa` it's useful to have files persist.
We recommend to write a simple abstraction that stashes & fetches the `tmp` folder to an S3/Object Storage folder for AWS Lambda functions, and thus fakes continuity between functions (at least between `bwa` steps).

#### Split `Storage` 

This function should split the reference genome `NC_000913.3.fasta` into smaller parts. You can use any library, binary, or shell command you find online to split FASTQ or FASTA files.

#### bwa index `Storage`

This function should run `bwa index` on a reference genome split created previously. It creates an index to make it better searchable.

#### bwa aln `Storage`

Run `bwa aln` (align) for a reference genome split created previously, for both read files (5'3 and 3'5, here R1 and R2). This is the main step of `bwa`; it aligns the reads to a reference genome. It is visualized in the table above.


Hints:
* 5'3 and 3'5 are directions on DNA strings, similar to 'upstream' and 'downstream' of a river. In paired-end sequencing, you read DNA from both directions (hence `hipa7_reads_R1.fastq` & `hipa7_reads_R2.fastq`). Thanks to the [structure of DNA](https://en.wikipedia.org/wiki/Directionality_(molecular_biology)), you always know what 5'3 and 3'5 is, regardless of how you look at it.


#### bwa sampe `Storage`

This function should run `bwa sampe` (**sam**-**p**aired-**e**nd) for the `.sai` pair created in the previous step (R1 and R2). This will put the aligned reads into one `.sam` file.

#### samtools merge

This function should run `samtools merge` to concat the `.sam` file of each reference genome split.

#### samtools sort, view, index

This function should run `samtools sort` to sort the `.sam` file.
Then, run `samtools view` to convert to a binary representation (`.bam` file).
Then, run `samtools index` created an index `.bam.bai` file.


Keep the `.bam` and `.bam.bai` file for Week C.


### Investigate with IGV

Read this paper's ([Korch, Hill. 2003](https://onlinelibrary.wiley.com/doi/full/10.1046/j.1365-2958.2003.03779.x)) abstract and reveal the following: 

* What is the name of the two mutations? 
* Where in the genome (what gene) do you have to look?
* What is the function of the `hipB` gene? Is it relevant for us?

Now we'll get to work. Download and start the [Integrative Genomics Viewer](https://software.broadinstitute.org/software/igv/download). 

1. Select the Ecoli reference genome (`NC_000913.3`) (Marker 1)
1. Import your reads with File > Load from file > Your `.bam` file
1. Jump to the gene you're interested in (Marker 2, Marker 5)

You can see your reads as grey bars in Marker 4. The arrow tips indicate read direction. A letter means the read is different to the reference genome in that spot. The more reads agree on a difference, the more confident you can be it is not just noise.

Check the gene for these two mutations. Is your Ecoli sample resistant to antibiotics? 

<img src="https://i.imgur.com/M6ST698.png" />


## MS4 (21.01.2021, Homework 07)

Develop the given scheduler to schedule the FC across all function deployments.


----


# Project 3: Prediction of stock prices `Storage, Forecast, webhook` (Python, Java, node.js)

You'll create a real-life FC to predict the price of stocks you can buy and sell.

## Introduction

### Motivation

You frequently trade with a wide variety of stocks on various stock exchanges. Every morning, your assistant compiles you a list of 50 stock that have performed interestingly and might be worth a look.

You want to see at a glance how these stocks could perform. Therefore you program an FC that takes these names, predicts their prices, and visualises their past and projected price.

This should be done in parallel, per stock. The result should be visualised together. The FC shoud return an URL of the visualisation.


### Input

```
['AAL', 'ALT', 'NCMI', ... ]
```

* A list of stock ticker symbols traded on some exchange.


### Rough steps

* Pull commodity prices to the storage
* Enter them into AWS Forecast
* Forecast for the coming year for each commodity
* Create a chart showing the past and future price of all commodities.

## MS2 (17.12.2020): Develop the FC with AFCL

Develop the preliminary FC with AFCL. 

Think about these things:

* How to group the above algorithm into functions 
* What you can do in parallel; what is independent from each other
* What information each function needs, how you best represent it (Storage ARNs, collections thereof, named fields)
* How information flows between your functions

Put together the FC using the FC editor, AFCL Java API, or the YAML editor. The main goal is to think about modularity and data flow. 

Create empty functions that just produce the data how you specified with AFCL. Run the FC with these functions with the *xAFCL* Enactment Engine.


## MS3 (07.01.2021, Homework 06): Code the functions + deploy them on across ultiple regions with a Terraform script


### Rough functions

#### Fetch and process `Storage, API`

Pull the historical daily prices of each stock in parallel to the storage. You can use [AlphaVantage](https://www.alphavantage.co/) to retrieve time series of prices.
You may have to do some processing, such as stripping unnecessary fields. It is up to you what exactly you want to predict, what pre-processing or enriching you do, how you pick related data, and so on.

Hints:
* If you want to incorporate market sentiment at that time, [this may help](https://raw.githubusercontent.com/qngapparat/sentim/master/python/qmarketin500.csv).

#### Enter into Forecast `Storage, Forecast`

Enter the historical data for given commodity into AWS Forecast.

#### Start `Storage, Forecast`

Start the forecast for given commidity, and move the results to a file on the storage. 

<!--Hints:
* Since you will be generating JavaScript code, it's useful to code this function in NodeJS
-->
#### Process result `Storage`

Fetch the result file for given commodity from the storage and prepare it for visualisation. Strip fields that you aren't interested in. Save it in a way that's easy to read for the following step.

#### Create chart `Storage, charting library or API`

Fetch all the result files, and create one or more charts that visualizes the past and projected price of the stocks.
Again, you have plenty leeway what you want to do here.


Hints:
* For creating charts the [Quickchart API](https://quickchart.io/) is convenient.


## MS4 (21.01.2021, Homework 07)

Develop the given scheduler to schedule the FC across all function deployments.

----

# Project 4: Gate Change Alert `Storage, Recognition Service, DB` (Python, Java, node.js)

You need to create an FC that performs a series of actions after a gate of a specific flight has changed at an airport. 

## Introduction

### Motivation

The FC reads the information about the flight, the new gate and then loads all available passenger data (from a Database) of that flight. Also, checks the queue length of the security check. Thereafter, for every passenger from that flight that is already at the airport, the FC reads the GPS location and calculates the time to gate. If the passenger is in the public area, the FC adds the delay for the security check. 

### Input 

- An image(s) of security check is stored on the storage. You may assume one or multiple security check queues and then calculate the overall average waiting time.
- threshold value (in seconds)
- flight number
- new gate


### Rough steps 

- create a database in format you like (in a container, run it in a VM, use some DB service of AWS/IBM)
- fill the database with some passenger data, flights, gates
- create a map of the Innsbruck Airport with GPS locations of security check and gates
- distinguish the security and public area
- read the images from the storage and use them as an input for AWS Rekognition / IBM 
- check the time to the new gate and inform the passenger accordingly based on the threshold value


## MS2 (17.12.2020): Develop the FC with AFCL

Develop a preliminary FC with AFCL. 

Think about these things:

* How to group the above algorithm into functions 
* What you can do in parallel; what is independent from each other (e.g. reading the passengers from the flight and calculating the security check delay)
* What information each function needs, how you best represent it (access images to the storage, collections for passengers)
* How information flows between your functions

Put together the FC using the FC editor, AFCL Java API, or the YAML editor. The main goal is to think about modularity and data flow. 

Create empty functions that just produce the data how you specified with AFCL. Run the FC with these functions with the *xAFCL* Enactment Engine.


## MS3 (07.01.2021, Homework 06): Code the functions + deploy them on across ultiple regions with a Terraform script

### Rough functions

#### Get passengers `Database`

This function should read all passengers that are at the airport. You may use a boolean flag in the database to know whether a passenger of the flight is present at the airport.
Think which passenger data you will need for later.

#### Calculate security check delay `Recognition Service` `S3 / Object Storage`

This function should load an image(s) from the storage and call the recognition service for each image (each waiting queue). In case you use more images, you would need a reduction function to calculate the average waiting time. 


#### Read GPS Location 

This function should return the GPS location of a passenger (e.g., from a DB). 


#### Estimate time between two GPS locations

This function should return the estimated time between two GPS locations (e.g., passenger - security check, security check - the new gate)


#### inform the passenger

This function should send a notification to a passenger based on the input. Select the notification channel you like (`email`, `slack`, `sms`, ...).

Hints:
* Choose an appropriate threshold such that the time to gate for some passengers is below, while for others is above the threshold.


## MS4 (21.01.2021, Homework 07)

Develop the given scheduler to schedule the FC across all function deployments.

----

# Other possible topics

## Digital Signal Processing `ECG, Storage, Libraries`

Initial idea: For a given set of files stored on the storage, chunk them, (pre)process the signals using distribution and libraries, check the risk for heart attack / anomalies and visualize it.

## Image processing `Storage, DB, Libraries`

Initial idea: A user logs in to the system, reads all images stored on the storage, process them (e.g., based on the name/location, add a signature, a watermark, encrypts them, etc.) 


## Something like Happy path (AWS-samples)

Check [Happy Path](https://github.com/aws-samples/happy-path) and [here](https://aws.amazon.com/blogs/compute/using-serverless-backends-to-iterate-quickly-on-web-apps-part-1/) - Step 4. Remove the faulty functions, but add alternative functions. Develop such application on IBM. Use AFCL instad of step functions. Introduce parallelism.


## Scientific workflows 

### Genome 1000 `Storage` (Probably for a single student in Python)

Develop the Genome FC on IBM [Genome](https://github.com/rosafilgueira/Mutation_Sets).


### Montage FC `Storage` 

Develop the Montage FC [Montage](http://montage.ipac.caltech.edu/docs/grid.html).




----

# Parts you can use in addition or propose another project topic, similar as the given ones


## AWS Educate

```
S3 Glacier
AWS Backup
DynamoDB (NoSQL)
ElastiCache (distributed in-memory DB)
QLDB (immutable transaction log)
Timestream (IoT)
Cloud Map (AWS resource query)
Chatbot (subscribed to SNS)
Polly  (Text-to-speech)
MediaConvert (from * to S3)
Kinesis video streams (from web, sdk, to S3, \*)
Lex (barebones Alexa)
Forecast (time-series)
Rekognition (Object and scene detection, facial, face comparison, text in image)
Comprehend (Natural text processing: entities, key phrases, personal data, language, sentiment)
Translate
Athena (big data query service, basically SQL)
Data exchange (miscellaneous data)
Sumerian (three.js in Browser)
SQS (pub-sub queue)
Greengrass (IoT, local / in-cloud processing)
```

## IBM Lite

```
Watson assistant (chatbot / text to some action)
Visual recognition (scenes, objects...)
Cloudant (JSON database)
Annotator for clinical data
Translate
Object storage
Natural language understanding
Speech to text (streaming transcription)
Text to speech
Tone analyzer (text sentiment)	
```
