import React, { Component } from 'react';
import './App.css';
import ObjectDetection from './components/ObjectDetection'

class App extends Component {
  state = {
    width: 640,
    height: 480
  }



  videoRef = React.createRef()
  canvasObjectRef = React.createRef()
  canvasFaceRef = React.createRef()

  render() {
    return( 
      <div className="App" >
      <h1>Hello from 3 NMD </h1>
      <h3>Run while you can.</h3>

     

      <ObjectDetection ref={this.videoRef} />
      <h3>Anna De Langhe & Nawang 10dar</h3>
    </div>
        )
  }
}

export default App;
