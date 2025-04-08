"use client";
import { useState, useRef, useEffect } from 'react';
import { PhotoIcon, CameraIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';


export default function QuestionForm({ onSubmit }) {
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

 

  // Check if device is mobile
  useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  // Check secure context
  const isSecureContext = () => {
    return window.isSecureContext;
  };

  
  
  // Get available camera devices
  useEffect(() => {
    if (!isCameraOpen) return;

    if (!isSecureContext()) {
      setError('Camera access requires a secure context (HTTPS)');
      setHasPermission(false);
      return;
    }

    const getDevices = async () => {
      try {
        // First get user media to ensure permissions are granted
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
        tempStream.getTracks().forEach(track => track.stop());
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        
      } catch (error) {
        console.error('Error enumerating devices:', error);
        setError('Could not access camera. Please check permissions.');
        setHasPermission(false);
      }
    };

    getDevices();
  }, [isCameraOpen]);

  // Start/stop camera stream
  useEffect(() => {
    if (!isCameraOpen || !selectedDevice) return;

    const startCamera = async () => {
      try {
        // Stop any existing stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }

        const constraints = isMobile
  ? {
      video: {
        facingMode: { exact: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    }
  : {
      video: {
        deviceId: selectedDevice,
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    };


        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setHasPermission(true);
        setError(null);
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
            setError('Could not start camera. Tap to try again.');
          });
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setHasPermission(false);
        setError('Could not access camera. Please check permissions.');
        
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: {
              facingMode: isMobile ? 'environment' : 'user'
            } 
          });
          setHasPermission(true);
          setError(null);
          streamRef.current = stream;
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => {
              console.error('Error playing video:', err);
            });
          }
        } catch (fallbackErr) {
          console.error('Fallback camera access failed:', fallbackErr);
          setError('Camera access failed. Please try uploading an image instead.');
        }
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isCameraOpen, selectedDevice, isMobile]);

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], 'captured-image.png', { type: 'image/png' });
      setImageFile(file);
      setIsCameraOpen(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }, 'image/png');
  };

  const openCamera = async () => {
    if (!isSecureContext()) {
      setError('Camera requires HTTPS connection');
      return;
    }

    try {
      const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
      tempStream.getTracks().forEach(track => track.stop());
      
      setIsCameraOpen(true);
      setError(null);
    } catch (err) {
      console.error('Camera permission denied:', err);
      setError('Camera access was denied. Please enable permissions in your browser settings.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const base64Image = await convertToBase64(imageFile);
      const result = await onSubmit({ image: base64Image });
      
      if (result.success) {
        setImageFile(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="bg-black/70 backdrop-blur-lg rounded-xl p-6 border border-gray-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.7)] transition-all duration-300">
  <h2 className="text-xl font-bold text-white/90 tracking-tight border-b border-white/10 pb-3 mb-4">
    UPLOAD QUESTION
  </h2>
  
  {error && (
    <div className="bg-red-900/40 border-l-4 border-red-500 text-red-200 p-4 backdrop-blur-sm">
      <p>{error}</p>
      {!isSecureContext() && (
        <p className="mt-2 text-sm text-red-300">
          {`You're currently on: ${window.location.protocol}//${window.location.host}`}
        </p>
      )}
    </div>
  )}

  <form onSubmit={handleSubmit} className="space-y-6">
    <div>
      <label className="block text-xs font-medium text-white/70 mb-2 tracking-widest uppercase">
        EXAM IMAGE
      </label>
      <div className="mt-1 border-2 border-white/10 bg-black/50 rounded-lg backdrop-blur-sm">
        {imageFile ? (
          <div className="relative">
            {imageFile.type.startsWith('image/') ? (
              <Image
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                width={500}
                height={300}
                className="mx-auto max-h-64 w-full object-contain p-4"
              />
            ) : (
              <div className="p-4 text-center text-white/60">Unsupported file type</div>
            )}
            <button
              type="button"
              onClick={() => setImageFile(null)}
              className="absolute top-2 right-2 bg-black/80 text-white/90 rounded-full p-1.5 border border-white/20 hover:bg-white/20 hover:text-white transition-all duration-200"
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : isCameraOpen ? (
          <div className="flex flex-col items-center p-4 space-y-4">
            <div className="relative w-full">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                muted
                className="w-full h-48 sm:h-64 object-cover bg-black/80 rounded-t-lg"
              />
              {hasPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white/80 p-4 text-center text-sm sm:text-base backdrop-blur-sm">
                  CAMERA PERMISSION DENIED
                </div>
              )}
            </div>
            
            {devices.length > 1 && (
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 text-white/90 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:outline-none text-sm sm:text-base"
              >
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
                  </option>
                ))}
              </select>
            )}
            
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={captureImage}
                className="flex-1 py-2 bg-white/10 text-white/90 border border-white/20 hover:bg-white/20 hover:text-white transition-all duration-200 rounded-lg text-sm sm:text-base"
              >
                CAPTURE
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCameraOpen(false);
                  if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                    streamRef.current = null;
                  }
                }}
                className="flex-1 py-2 bg-black/60 text-white/90 border border-white/20 hover:bg-black/80 hover:text-white transition-all duration-200 rounded-lg text-sm sm:text-base"
              >
                CANCEL
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-6 sm:p-8 space-y-4">
            <PhotoIcon className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-white/30" />
            <div className="flex flex-col items-center space-y-3">
              <div className="flex text-xs sm:text-sm">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-white/80 border-b border-white/40 hover:text-white hover:border-white/60 transition-colors duration-150"
                >
                  UPLOAD FILE
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    disabled={isSubmitting}
                  />
                </label>
                <span className="mx-2 text-white/30">|</span>
                <button
                  type="button"
                  onClick={openCamera}
                  className="flex text-white/80 items-center border-b border-white/40 hover:text-white hover:border-white/60 transition-colors duration-150"
                >
                  <CameraIcon className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                  TAKE PHOTO
                </button>
              </div>
              <p className="text-xs text-white/50">PNG, JPG UP TO 10MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
    
    <button
      type="submit"
      className="w-full py-3 bg-white/10 text-white/90 font-medium border border-white/20 hover:bg-white/20 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-lg flex items-center justify-center gap-2"
      disabled={!imageFile || isSubmitting}
    >
      {isSubmitting ? (
        <>
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          UPLOADING...
        </>
      ) : (
        'SUBMIT QUESTION'
      )}
    </button>
  </form>
  <canvas ref={canvasRef} className="hidden" />
</div>
  );
}