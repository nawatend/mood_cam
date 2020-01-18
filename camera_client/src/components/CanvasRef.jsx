import React, { Component } from 'react';
import '../App.css';


class CanvasRef extends Component {
    state = {
        width: 640,
        height: 480
    }
    render() {
        return (<canvas className="canvas" width={this.state.width} height={this.state.height} />
        );
    }
}

export default CanvasRef;