import React, { Component } from 'react';
import '../App.css';


class VideoRef extends Component {
    state = {
        width: 640,
        height: 480
    }
    render() {
        return (
            <video
                className="video"
                width="auto"
                height="auto"
                autoPlay
                muted
            />
        );
    }
}

export default VideoRef;