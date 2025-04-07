
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Video, VideoOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ExerciseType = 'handsUp' | 'handsCurl' | 'sitAndReach';

interface ExerciseDetectorProps {
  exerciseType: ExerciseType;
}

export default function ExerciseDetector({ exerciseType }: ExerciseDetectorProps) {
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const exerciseInstructions = {
    handsUp: "Raise both hands above your head, then lower them slowly.",
    handsCurl: "With your arms extended, slowly curl your hands towards your shoulders and back.",
    sitAndReach: "Sitting down, lean forward and try to reach your toes, then return to sitting position."
  };

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
    } else {
      // Turn on webcam
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsWebcamOn(true);
        toast({
          title: "Webcam Active",
          description: "Position yourself in the center of the frame.",
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

  // Simulate exercise detection and feedback
  useEffect(() => {
    if (!isWebcamOn) return;

    let exerciseInterval: number;
    
    // In a real app, this would be replaced with actual pose detection logic
    exerciseInterval = window.setInterval(() => {
      // Randomly determine if the exercise was done correctly
      const isCorrect = Math.random() > 0.3;
      
      if (isCorrect) {
        setRepCount(prev => prev + 1);
        setFeedback("Great job! Keep going!");
      } else {
        // Generate random feedback based on exercise type
        const feedbackMessages = {
          handsUp: ["Try to raise your hands higher", "Keep your back straight", "Extend your arms fully"],
          handsCurl: ["Curl your hands closer to your shoulders", "Keep your elbows steady", "Slow down the movement"],
          sitAndReach: ["Bend from your hips, not just your back", "Reach further if you can", "Keep your legs straight"]
        };
        
        const messages = feedbackMessages[exerciseType];
        setFeedback(messages[Math.floor(Math.random() * messages.length)]);
      }
    }, 5000); // Check every 5 seconds for demo purposes
    
    return () => clearInterval(exerciseInterval);
  }, [isWebcamOn, exerciseType]);

  return (
    <div className="card-shravan flex flex-col items-center">
      <h3 className="text-2xl font-bold mb-4">
        {exerciseType === 'handsUp' && "Hands Up Exercise"}
        {exerciseType === 'handsCurl' && "Hands Curl Exercise"}
        {exerciseType === 'sitAndReach' && "Sit and Reach Exercise"}
      </h3>
      
      <p className="text-muted-foreground mb-6">{exerciseInstructions[exerciseType]}</p>
      
      <div className="relative w-full max-w-md aspect-video bg-muted rounded-xl overflow-hidden mb-4">
        {isWebcamOn ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
        
        {isWebcamOn && (
          <div className="absolute top-3 right-3 bg-shravan-mint text-primary-foreground font-bold rounded-full px-3 py-1">
            Reps: {repCount}
          </div>
        )}
      </div>
      
      {feedback && (
        <div className={`mb-4 p-3 rounded-lg ${feedback.includes('Great') ? 'bg-shravan-mint text-primary-foreground' : 'bg-shravan-peach text-secondary-foreground'} flex items-center gap-2`}>
          {feedback.includes('Great') ? (
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
