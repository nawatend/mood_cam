import React, { Component } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as faceapi from 'face-api.js';
import '../App.css';
import firebase from '../utils/firebase'
import getTodayDate from '../utils/functions'

class ObjectDetection extends Component {

    state = {
        width: 640,
        height: 480,
        detectedNames: []
    }

    constructor(props) {
        super(props)

        this.videoRef = React.createRef()
        this.canvasObjectRef = React.createRef()
        this.canvasFaceRef = React.createRef()
        this.database = firebase.database()
        this.img = new Image()


    }

    handleDetections = (detections) => {
        let newArray = [...this.state.detectedNames]
        let allObjectsRef = this.database.ref('objects/')
        let todayObjectRef = this.database.ref('objects/' + getTodayDate() + '/')

        if (detections.length > 0) {
            detections.forEach((detection, id) => {

                //check if new detection is in array of 1 sec ago
                if (newArray.includes(detection.class)) {
                    // + one to detected class - in Firebase

                } else {
                    //add to array for FIREBASE
                    newArray.push(detection.class)
                    this.setState({ detectedNames: newArray })
                }

                allObjectsRef.once('value', (snapshots) => {
                    if (snapshots.hasChild(getTodayDate())) {
                        //  console.log('today exist')
                    } else {
                        this.database.ref("objects/" + getTodayDate() + "/" + detection.class).set(1)
                    }
                })

                // console.log("Max Detections: " + detections.length)
                // Push and empty array for FIREBASE
                todayObjectRef.once('value', (snapshots) => {
                    snapshots.forEach(snapshot => {
                        if (snapshot.key === detection.class) {
                            let total = snapshot.val()
                            this.database.ref("objects/" + getTodayDate() + "/" + snapshot.key).set(++total)
                            // console.log('Push TO FIREBASE')
                        } else {
                            if (!snapshots.hasChild(detection.class)) {
                                //add new object to today's detected
                                this.database.ref("objects/" + getTodayDate() + "/" + detection.class).set(1)
                            }
                            //console.log(' Not Push TO FIREBASE')
                        }


                    });
                })
                //  this.database.ref("objects/" + getTodayDate() + "/" + this.state.detectedNames[0]).set(1)
                //empty array
                if (id === (detections.length - 1)) {
                    this.setState({ detectedNames: [] })
                }
            })
        } else {
            //EMPTY state.detectedNames
            console.log('Nothing is detected')
        }
    }


    detectObjectFromVideo = (model, video) => {
        model.detect(video).then(detections => {
            this.renderDetections(detections);

            // requestAnimationFrame(() => {
            //     this.detectObjectFromVideo(model, video);
            // });

            // this.setState({ detects: [...detections] })

            //this.detectObjectFromVideo(model, video)
            //console.log(detections)

        }, (error) => {
            console.log("Webcam is not active.")
            console.error(error)
        });
    };


    drawFilter = (canvasContext, detections) => {

        if (detections.length === 1) {



            let x = detections[0].detection.box.x
            let y = detections[0].detection.box.y
            let width = detections[0].detection.box.width
            let height = detections[0].detection.box.height

            canvasContext.strokeStyle = "red"
            canvasContext.strokeWidth = 1


            canvasContext.strokeRect(x, y, width, height)



            canvasContext.drawImage(this.img, x, y, width, height)
            console.log('filter drawn')


        }
    }


    detectFaceFromVideo = async (video) => {

        const canvas = this.canvasFaceRef.current
        const displaySize = {
            width: this.state.width,
            height: this.state.height
        }

        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        //faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        //faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        this.drawFilter(canvas.getContext('2d'), detections)
        console.log(resizedDetections)
        resizedDetections.forEach(result => {
            const {
                gender,
                genderProbability
            } = result
            new faceapi.draw.DrawTextField(
                [
                    `Gender: ${gender} (${genderProbability.toFixed(2)})`
                ],
                result.detection.box.topRight
            ).draw(canvas)

        })

    }

    renderDetections = detections => {
        const ctx = this.canvasObjectRef.current.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const font = "18px Laca";
        ctx.font = font;
        ctx.textBaseline = "top";

        detections.forEach(detection => {

            if (detection.score.toFixed(2) >= 0.70) {
                const x = detection.bbox[0];
                const y = detection.bbox[1];
                const width = detection.bbox[2];
                const height = detection.bbox[3];
                // Draw the bounding box
                ctx.strokeStyle = "#ffd369";
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, width, height);
                // Draw the label background.
                ctx.fillStyle = "#ffd369";
                const textWidth = ctx.measureText(detection.class).width;
                const textHeight = parseInt(font, 10);
                // draw top left rectangle
                ctx.fillRect(x, y, textWidth + 5, textHeight + 5);
                // draw bottom left rectangle
                ctx.fillRect(x, y + height - textHeight, textWidth, textHeight);

                // Draw the text last to ensure it's on top.
                ctx.fillStyle = "#015668";
                ctx.fillText(detection.class, x, y);
                ctx.fillText(detection.score.toFixed(2), x, y + height - textHeight);
            }
        });
        this.handleDetections(detections)
    };

    componentDidMount() {

        this.img.src = "teddy.png"



        if (navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia) {
            // define a Promise that'll be used to load the webcam and read its frames
            const webcamPromise = navigator.mediaDevices
                .getUserMedia({
                    video: true,
                    audio: false,
                })
                .then(stream => {
                    // pass the current frame to the window.stream
                    window.stream = stream;
                    // pass the stream to the videoRef
                    this.videoRef.current.srcObject = stream;

                    return new Promise(resolve => {
                        this.videoRef.current.onloadedmetadata = () => {
                            resolve();
                        };
                    });
                }, (error) => {
                    console.log("Webcam is not active")
                    console.error(error)
                });

            // define a Promise that'll be used to load the model
            const loadlModelPromise = cocoSsd.load();

            // resolve all the Promises
            Promise.all([loadlModelPromise, webcamPromise,
                faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
                faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                faceapi.nets.faceExpressionNet.loadFromUri('/models'),
                faceapi.nets.ageGenderNet.loadFromUri('/models')
            ]).then(values => {
                setInterval(() => {
                    //this.detectObjectFromVideo(model, video)
                    this.detectObjectFromVideo(values[0], this.videoRef.current)
                    this.detectFaceFromVideo(this.videoRef.current)

                }, 1000)

            })
                .catch(error => {
                    console.error(error);
                });
        }
    }



    render() {
        return (
            <div className="feed">
                <video
                    className="video"
                    ref={this.videoRef}
                    width="auto"
                    height="auto"
                    autoPlay
                    muted
                />


                <canvas className="canvas" ref={this.canvasObjectRef} width={this.state.width} height={this.state.height} />
                <canvas className="canvas" ref={this.canvasFaceRef} width={this.state.width} height={this.state.height} />
            </div>
        )
    }
}

export default ObjectDetection;