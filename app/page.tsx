// page.tsx
"use client";

import { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

export default function Home() {

    const webcamRef = useRef(null);

    useEffect(() => {
        getVideo();
    }, [webcamRef]);

    const getVideo = () => {
        navigator.mediaDevices
            .getUserMedia({ video: { facingMode: "user" } })
            .then(stream => {
                let video = webcamRef.current;
                    if (video) {
                        // @ts-ignore
                        video.srcObject = stream;
                        // @ts-ignore
                        video.play();
                    }


            })
            .catch(err => {
                console.error("error:", err);
            });
    }

    return (
        <div>
            <Webcam
                audio={false}
                height={480}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={640}
                videoConstraints={{
                    facingMode: "user"
                }}
            />
        </div>
    );
}