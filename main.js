const video = document.getElementById('video')
const labels = ['nawang', 'anna']




Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models')

]).then(startVideo)

function startVideo() {
  navigator.getUserMedia({
      video: {}
    },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}




const labeledFaceDescriptors = async () => await Promise.all(
  labels.map(async label => {
    // fetch image data from urls and convert blob to HTMLImage element
    const imgUrl = `${label}.png`
    const img = await faceapi.fetchImage(imgUrl)

    // detect the face with the highest score in the image and compute it's landmarks and face descriptor
    const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()

    if (!fullFaceDescription) {
      throw new Error(`no faces detected for ${label}`)
    }

    const faceDescriptors = [fullFaceDescription.descriptor]
    return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
  })
)
// 0.6 is a good distance threshold value to judge
// whether the descriptors match or not
// const maxDescriptorDistance = 0.6
// const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance)




video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = {
    width: video.width,
    height: video.height
  }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)


    resizedDetections.forEach(result => {
      const {
        age,
        gender,
        genderProbability
      } = result
      new faceapi.draw.DrawTextField(
        [
          `Age: ${faceapi.round(age, 0)} years`,
          `Gender: ${gender} (${faceapi.round(genderProbability)})`
        ],
        result.detection.box.topRight
      ).draw(canvas)
    })

    //face recognition




    // const results = fullFaceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor))
    // results.forEach((bestMatch, i) => {
    //   const box = fullFaceDescriptions[i].detection.box
    //   const text = bestMatch.toString()
    //   const drawBox = new faceapi.draw.DrawBox(box, {
    //     label: text
    //   })
    //   drawBox.draw(canvas)
    // })

  }, 100)
})