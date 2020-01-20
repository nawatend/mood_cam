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
        objectDetectedNames: []
    }

    constructor(props) {
        super(props)

        this.videoRef = React.createRef()
        this.canvasObjectRef = React.createRef()
        this.canvasFaceRef = React.createRef()
        this.database = firebase.database()
        this.img = new Image()
    }

    handleDetections = (objectDetections) => {

        //copy from currect state 
        let newArray = [...this.state.objectDetectedNames]
        let allObjectsRef = this.database.ref('objects/')
        let todayObjectRef = this.database.ref('objects/' + getTodayDate() + '/')

        //if person detected: create this object in firebase DB
        let personObject = { totalPerson: 1, neutral: 1, happy: 0, sad: 0, surprised: 0, disgusted: 0, angry: 0, man: 0, woman: 0 }

        if (objectDetections.length > 0) {
            objectDetections.forEach((objectDetection, id) => {
                if (objectDetection.score.toFixed(2) >= 0.70) {
                    //check if new detection is in array of 1 sec ago
                    if (newArray.includes(objectDetection.class)) {
                        // + one to detected class - in Firebase

                    } else {
                        //add to array for FIREBASE
                        newArray.push(objectDetection.class)
                        this.setState({ detectedNames: newArray })
                    }

                    //check if today date object is exist
                    allObjectsRef.once('value', (snapshots) => {
                        if (snapshots.hasChild(getTodayDate())) {
                            //  console.log('today exist')
                        } else {
                            if (objectDetection.class === "person") {
                                this.database.ref("objects/" + getTodayDate() + "/" + objectDetection.class).set(personObject)
                            } else {
                                //add new object to today's detected
                                this.database.ref("objects/" + getTodayDate() + "/" + objectDetection.class).set(1)
                            }
                        }
                    })


                    // Push object to db FIREBASE
                    todayObjectRef.once('value', (snapshots) => {
                        snapshots.forEach(snapshot => {
                            if (snapshot.key === objectDetection.class) {

                                let total = 0

                                if (objectDetection.class !== "person") {
                                    total = snapshot.val()
                                    this.database.ref("objects/" + getTodayDate() + "/" + snapshot.key).set(++total)
                                } else {
                                    total = snapshot.val().totalPerson
                                    this.database.ref("objects/" + getTodayDate() + "/" + snapshot.key + "/totalPerson").set(++total)
                                }
                            } else {
                                if (!snapshots.hasChild(objectDetection.class)) {

                                    if (objectDetection.class === "person") {
                                        //if person detected: create this object in firebase DB
                                        this.database.ref("objects/" + getTodayDate() + "/" + objectDetection.class).set(personObject)
                                    } else {
                                        //add new object to today's detected
                                        this.database.ref("objects/" + getTodayDate() + "/" + objectDetection.class).set(1)
                                    }
                                }
                            }
                        });
                    })

                }

                //empty array
                if (id === (objectDetections.length - 1)) {
                    this.setState({ objectDetectedNames: [] })
                }
            })
        } else {
            //EMPTY state.objectDetectedNames
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


    drawFilter = (canvasContext, faceDetections) => {

        if (faceDetections.length >= 1) {

            faceDetections.forEach((faceDetection) => {
                //this one line code from online
                let faceEmotion = Object.keys(faceDetection.expressions).reduce((a, b) => faceDetection.expressions[a] > faceDetection.expressions[b] ? a : b);

                this.database.ref("objects/" + getTodayDate() + "/person/" + faceEmotion).set(5)

                //load image by emotion
                faceEmotion += ".png"
                this.img.src = "filters/" + faceEmotion

                let x = faceDetection.detection.box.x + 30
                let y = faceDetection.detection.box.y - 20
                let width = faceDetection.detection.box.width * 0.8
                let height = faceDetection.detection.box.height

                // canvasContext.strokeStyle = "green"
                // canvasContext.strokeWidth = 1
                //canvasContext.strokeRect(x, y, width, height)

                //1:1.55 filter image ratio
                canvasContext.drawImage(this.img, x, y, width, width * 1.255)
                console.log('filter drawn')
            })
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
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        this.drawFilter(canvas.getContext('2d'), detections)
        //console.log(resizedDetections)
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

    renderDetections = objectDetections => {
        const ctx = this.canvasObjectRef.current.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const font = "18px Laca";
        ctx.font = font;
        ctx.textBaseline = "top";

        objectDetections.forEach(objectDetection => {

            //draw frame only if prediction accuracy is more than 70%
            if (objectDetection.score.toFixed(2) >= 0.70) {
                const x = objectDetection.bbox[0];
                const y = objectDetection.bbox[1];
                const width = objectDetection.bbox[2];
                const height = objectDetection.bbox[3];
                // Draw the bounding box
                ctx.strokeStyle = "#ffd369";
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, width, height);
                // Draw the label background.
                ctx.fillStyle = "#ffd369";
                const textWidth = ctx.measureText(objectDetection.class).width;
                const textHeight = parseInt(font, 10);
                // draw top left rectangle
                ctx.fillRect(x, y, textWidth + 5, textHeight + 5);
                // draw bottom left rectangle
                ctx.fillRect(x, y + height - textHeight, textWidth, textHeight);

                // Draw the text last to ensure it's on top.
                ctx.fillStyle = "#015668";
                ctx.fillText(objectDetection.class, x, y);
                ctx.fillText(objectDetection.score.toFixed(2), x, y + height - textHeight);
            }
        });
        //what to do with data detected
        this.handleDetections(objectDetections)
    };

    componentDidMount() {

        if (navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia) {
            // load cam and read its frames
            const webcamPromise = navigator.mediaDevices
                .getUserMedia({
                    video: true,
                    audio: false,
                })
                .then(stream => {
                    // send current frame to the window.stream
                    window.stream = stream;
                    // send stream to the videoRef
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

            //load the model
            const loadlModelPromise = cocoSsd.load();

            // resolve Promises all
            Promise.all([loadlModelPromise, webcamPromise,
                faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
                faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                faceapi.nets.faceExpressionNet.loadFromUri('/models'),
                faceapi.nets.ageGenderNet.loadFromUri('/models')
            ]).then(values => {
                //detect every 1000 ms = 1 sec
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