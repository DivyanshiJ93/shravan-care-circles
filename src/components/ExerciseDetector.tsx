
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Video, VideoOff, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs-core';

type ExerciseType = 'handsUp' | 'handsCurl' | 'sitAndReach';

interface ExerciseDetectorProps {
  exerciseType: ExerciseType;
}

// Exercise specific configurations
const exerciseConfigs = {
  handsUp: {
    description: "Raise both hands above your head, then lower them slowly.",
    detectPose: (keypoints: poseDetection.Keypoint[]) => {
      if (!keypoints || keypoints.length < 1) return { isCorrect: false, feedback: "No pose detected" };
      
      const leftWrist = keypoints.find(kp => kp.name === 'left_wrist');
      const rightWrist = keypoints.find(kp => kp.name === 'right_wrist');
      const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
      const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
      
      if (!leftWrist || !rightWrist || !leftShoulder || !rightShoulder) {
        return { isCorrect: false, feedback: "Cannot detect your wrists or shoulders" };
      }
      
      // Check if hands are raised above shoulders
      const handsUp = leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;
      
      return {
        isCorrect: handsUp,
        feedback: handsUp ? "Great! Hands are up!" : "Raise your hands above your shoulders"
      };
    },
    detectRep: (poses: poseDetection.Pose[], lastPose: string | null) => {
      if (!poses || poses.length === 0 || !poses[0].keypoints) return { newRep: false, currentPose: lastPose };
      
      const keypoints = poses[0].keypoints;
      const leftWrist = keypoints.find(kp => kp.name === 'left_wrist');
      const rightWrist = keypoints.find(kp => kp.name === 'right_wrist');
      const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
      const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
      
      if (!leftWrist || !rightWrist || !leftShoulder || !rightShoulder) {
        return { newRep: false, currentPose: lastPose };
      }
      
      const handsUp = leftWrist.y < leftShoulder.y - 50 && rightWrist.y < rightShoulder.y - 50;
      const handsDown = leftWrist.y > leftShoulder.y + 50 && rightWrist.y > rightShoulder.y + 50;
      
      let newPose = null;
      if (handsUp) newPose = 'up';
      else if (handsDown) newPose = 'down';
      
      // Count a rep when hands go from up to down
      const newRep = lastPose === 'up' && newPose === 'down';
      
      return { newRep, currentPose: newPose || lastPose };
    }
  },
  handsCurl: {
    description: "With your arms extended, slowly curl your hands towards your shoulders and back.",
    detectPose: (keypoints: poseDetection.Keypoint[]) => {
      if (!keypoints || keypoints.length < 1) return { isCorrect: false, feedback: "No pose detected" };
      
      const leftWrist = keypoints.find(kp => kp.name === 'left_wrist');
      const rightWrist = keypoints.find(kp => kp.name === 'right_wrist');
      const leftElbow = keypoints.find(kp => kp.name === 'left_elbow');
      const rightElbow = keypoints.find(kp => kp.name === 'right_elbow');
      const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
      const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
      
      if (!leftWrist || !rightWrist || !leftElbow || !rightElbow || !leftShoulder || !rightShoulder) {
        return { isCorrect: false, feedback: "Cannot detect your arms properly" };
      }
      
      // Calculate angle between wrist, elbow and shoulder
      const leftAngle = calculateAngle(leftWrist, leftElbow, leftShoulder);
      const rightAngle = calculateAngle(rightWrist, rightElbow, rightShoulder);
      
      const isCurled = leftAngle < 90 || rightAngle < 90;
      
      return {
        isCorrect: isCurled,
        feedback: isCurled ? "Good curl position!" : "Curl your arms more towards your shoulders"
      };
    },
    detectRep: (poses: poseDetection.Pose[], lastPose: string | null) => {
      if (!poses || poses.length === 0 || !poses[0].keypoints) return { newRep: false, currentPose: lastPose };
      
      const keypoints = poses[0].keypoints;
      const leftWrist = keypoints.find(kp => kp.name === 'left_wrist');
      const rightWrist = keypoints.find(kp => kp.name === 'right_wrist');
      const leftElbow = keypoints.find(kp => kp.name === 'left_elbow');
      const rightElbow = keypoints.find(kp => kp.name === 'right_elbow');
      const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
      const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
      
      if (!leftWrist || !rightWrist || !leftElbow || !rightElbow || !leftShoulder || !rightShoulder) {
        return { newRep: false, currentPose: lastPose };
      }
      
      const leftAngle = calculateAngle(leftWrist, leftElbow, leftShoulder);
      const rightAngle = calculateAngle(rightWrist, rightElbow, rightShoulder);
      
      let newPose = null;
      if (leftAngle < 80 || rightAngle < 80) newPose = 'curled';
      else if (leftAngle > 150 || rightAngle > 150) newPose = 'extended';
      
      // Count a rep when arms go from curled to extended
      const newRep = lastPose === 'curled' && newPose === 'extended';
      
      return { newRep, currentPose: newPose || lastPose };
    }
  },
  sitAndReach: {
    description: "Sitting down, lean forward and try to reach your toes, then return to sitting position.",
    detectPose: (keypoints: poseDetection.Keypoint[]) => {
      if (!keypoints || keypoints.length < 1) return { isCorrect: false, feedback: "No pose detected" };
      
      const nose = keypoints.find(kp => kp.name === 'nose');
      const leftHip = keypoints.find(kp => kp.name === 'left_hip');
      const rightHip = keypoints.find(kp => kp.name === 'right_hip');
      const leftAnkle = keypoints.find(kp => kp.name === 'left_ankle');
      const rightAnkle = keypoints.find(kp => kp.name === 'right_ankle');
      
      if (!nose || !leftHip || !rightHip || !leftAnkle || !rightAnkle) {
        return { isCorrect: false, feedback: "Cannot detect your position properly" };
      }
      
      // Check if leaning forward 
      const hipY = (leftHip.y + rightHip.y) / 2;
      const isReaching = nose.y > hipY;
      
      return {
        isCorrect: isReaching,
        feedback: isReaching ? "Good reaching position!" : "Try to bend forward more"
      };
    },
    detectRep: (poses: poseDetection.Pose[], lastPose: string | null) => {
      if (!poses || poses.length === 0 || !poses[0].keypoints) return { newRep: false, currentPose: lastPose };
      
      const keypoints = poses[0].keypoints;
      const nose = keypoints.find(kp => kp.name === 'nose');
      const leftHip = keypoints.find(kp => kp.name === 'left_hip');
      const rightHip = keypoints.find(kp => kp.name === 'right_hip');
      
      if (!nose || !leftHip || !rightHip) {
        return { newRep: false, currentPose: lastPose };
      }
      
      // Calculate if leaning forward or sitting upright
      const hipY = (leftHip.y + rightHip.y) / 2;
      
      let newPose = null;
      if (nose.y > hipY + 30) newPose = 'reaching';
      else if (nose.y < hipY - 10) newPose = 'upright';
      
      // Count a rep when going from reaching to upright
      const newRep = lastPose === 'reaching' && newPose === 'upright';
      
      return { newRep, currentPose: newPose || lastPose };
    }
  }
};

// Helper function to calculate angle between three points
const calculateAngle = (
  pointA: poseDetection.Keypoint, 
  pointB: poseDetection.Keypoint, 
  pointC: poseDetection.Keypoint
) => {
  const radians = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) - 
                  Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  if (angle > 180.0) angle = 360.0 - angle;
  return angle;
};

export default function ExerciseDetector({ exerciseType }: ExerciseDetectorProps) {
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [lastPose, setLastPose] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  // Initialize pose detector
  useEffect(() => {
    const initializeDetector = async () => {
      if (!detector) {
        try {
          await tf.ready();
          const model = poseDetection.SupportedModels.MoveNet;
          const detector = await poseDetection.createDetector(model, {
            modelType: 'lightning',
            enableSmoothing: true
          });
          setDetector(detector);
        } catch (error) {
          console.error('Error initializing pose detector:', error);
          toast({
            title: "Initialization Error",
            description: "Could not initialize pose detection. Please try again.",
            variant: "destructive"
          });
        }
      }
    };
    
    if (isWebcamOn) {
      initializeDetector();
    }
    
    return () => {
      // Cleanup function
      if (detector) {
        // No explicit detector cleanup needed
      }
    };
  }, [isWebcamOn, detector, toast]);
  
  // Cleanup function for webcam
  useEffect(() => {
    return () => {
      // Cleanup function to stop webcam when component unmounts
      if (isWebcamOn && videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isWebcamOn]);
  
  // Pose detection loop
  useEffect(() => {
    let animationFrameId: number;
    
    const detectPose = async () => {
      if (!detector || !videoRef.current || !canvasRef.current || !isWebcamOn) return;
      
      try {
        const poses = await detector.estimatePoses(videoRef.current);
        
        // Draw pose on canvas
        if (poses.length > 0) {
          const ctx = canvasRef.current.getContext('2d');
          
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            
            // Draw connection lines
            ctx.strokeStyle = '#8ECDA0';
            ctx.lineWidth = 3;
            
            const keypoints = poses[0].keypoints;
            
            // Check if the exercise pose is correct and provide feedback
            const config = exerciseConfigs[exerciseType];
            const { isCorrect, feedback: poseFeedback } = config.detectPose(keypoints);
            
            if (feedback !== poseFeedback) {
              setFeedback(poseFeedback);
            }
            
            // Check for rep completion
            const { newRep, currentPose } = config.detectRep(poses, lastPose);
            if (currentPose !== lastPose) {
              setLastPose(currentPose);
            }
            
            if (newRep) {
              setRepCount(prev => prev + 1);
              toast({
                title: "Rep Completed!",
                description: `Great job! You've completed ${repCount + 1} repetitions.`
              });
            }
            
            // Draw keypoints
            keypoints.forEach(keypoint => {
              if (keypoint.score > 0.3) {
                ctx.beginPath();
                ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = isCorrect ? '#8ECDA0' : '#FF6B6B';
                ctx.fill();
              }
            });
            
            // Draw skeleton connections (simplified)
            const connections = [
              ['nose', 'left_shoulder'], ['nose', 'right_shoulder'],
              ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
              ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'],
              ['left_shoulder', 'right_shoulder'],
              ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
              ['left_hip', 'right_hip'],
              ['left_hip', 'left_knee'], ['left_knee', 'left_ankle'],
              ['right_hip', 'right_knee'], ['right_knee', 'right_ankle']
            ];
            
            connections.forEach(([p1Name, p2Name]) => {
              const p1 = keypoints.find(kp => kp.name === p1Name);
              const p2 = keypoints.find(kp => kp.name === p2Name);
              
              if (p1 && p2 && p1.score > 0.3 && p2.score > 0.3) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            });
          }
        }
      } catch (error) {
        console.error('Error detecting pose:', error);
      }
      
      animationFrameId = requestAnimationFrame(detectPose);
    };
    
    if (isWebcamOn && detector) {
      detectPose();
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isWebcamOn, detector, exerciseType, feedback, lastPose, repCount, toast]);
  
  const toggleWebcam = async () => {
    if (isWebcamOn) {
      // Turn off webcam
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsWebcamOn(false);
      setRepCount(0);
      setFeedback(null);
      setLastPose(null);
    } else {
      // Turn on webcam
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (canvasRef.current) {
              canvasRef.current.width = videoRef.current!.videoWidth;
              canvasRef.current.height = videoRef.current!.videoHeight;
            }
          };
        }
        
        setIsWebcamOn(true);
        toast({
          title: "Webcam Active",
          description: "Position yourself in the center of the frame for better detection.",
        });
      } catch (error) {
        console.error('Error accessing webcam:', error);
        toast({
          title: "Webcam Error",
          description: "Could not access your camera. Please check permissions.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="card-shravan flex flex-col items-center">
      <h3 className="text-2xl font-bold mb-4">
        {exerciseType === 'handsUp' && "Hands Up Exercise"}
        {exerciseType === 'handsCurl' && "Hands Curl Exercise"}
        {exerciseType === 'sitAndReach' && "Sit and Reach Exercise"}
      </h3>
      
      <p className="text-muted-foreground mb-6">{exerciseConfigs[exerciseType].description}</p>
      
      <div className="relative w-full max-w-md aspect-video bg-muted rounded-xl overflow-hidden mb-4">
        {isWebcamOn ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
        
        {isWebcamOn && (
          <div className="absolute top-3 right-3 bg-shravan-mint text-primary-foreground font-bold rounded-full px-3 py-1 flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span>Reps: {repCount}</span>
          </div>
        )}
      </div>
      
      {feedback && (
        <div className={`mb-4 p-3 rounded-lg ${feedback.includes('Great') || feedback.includes('Good') ? 'bg-shravan-mint text-primary-foreground' : 'bg-shravan-peach text-secondary-foreground'} flex items-center gap-2`}>
          {feedback.includes('Great') || feedback.includes('Good') ? (
            <Check className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
          <span>{feedback}</span>
        </div>
      )}
      
      <Button 
        onClick={toggleWebcam} 
        className={`btn-shravan ${isWebcamOn ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'btn-primary'}`}
      >
        {isWebcamOn ? (
          <>
            <VideoOff className="mr-2 h-5 w-5" />
            Stop Camera
          </>
        ) : (
          <>
            <Video className="mr-2 h-5 w-5" />
            Start Camera
          </>
        )}
      </Button>
    </div>
  );
}
