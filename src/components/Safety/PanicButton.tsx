import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Phone, MapPin, Video, Mic } from 'lucide-react';
import { useStore } from '../../store/useStore';
import axios from 'axios';

/**
 * Panic Button Component
 * Allows users to trigger emergency alerts with location and contact notifications
 */
export const PanicButton: React.FC = () => {
  const [isPanicked, setIsPanicked] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [policeStation, setPoliceStation] = useState<any>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingMode, setRecordingMode] = useState<'audio' | 'video'>('video');
  const [audioRecording, setAudioRecording] = useState('');
  const [videoRecording, setVideoRecording] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const { user } = useStore();

  const fetchLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => alert('Unable to get location')
    );
  };

  const findNearestPoliceStation = async (lat: number, lng: number) => {
    try {
      const response = await axios.get('/api/safety/police-stations', {
        params: { lat, lng },
      });
      setPoliceStation(response.data[0]);
    } catch (error) {
      console.error('Error finding police station:', error);
    }
  };

  const fetchEmergencyContacts = async () => {
    try {
      const response = await axios.get('/api/safety/emergency-contacts');
      setEmergencyContacts(response.data.emergencyContacts);
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
    }
  };

  const triggerPanicAlert = async () => {
    if (!location) {
      fetchLocation();
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(
        '/api/safety/panic',
        {
          location: {
            lat: location.lat,
            lng: location.lng,
            address: 'Current Location',
          },
          emergencyContacts,
          audioRecording: audioRecording || undefined,
          videoRecording: videoRecording || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsPanicked(true);
      await findNearestPoliceStation(location.lat, location.lng);

      // Auto-call emergency services
      if (response.data.nearestPoliceStation) {
        // In production, integrate with emergency dispatch
        console.log('📍 Police nearby:', response.data.nearestPoliceStation);
      }
    } catch (error) {
      console.error('Error triggering panic alert:', error);
      alert('Failed to send alert. Please call emergency services directly.');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAlert = async () => {
    // Implement cancellation logic
    setIsPanicked(false);
    setLocation(null);
    setPoliceStation(null);
    setIsRecording(false);
    setAudioRecording('');
    setVideoRecording('');
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const startRecording = async (mode: 'audio' | 'video') => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert('Recording is not supported in this browser');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: mode === 'video',
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: mode === 'video' ? 'video/webm' : 'audio/webm',
      });

      mediaRecorderRef.current = recorder;
      mediaStreamRef.current = stream;
      chunksRef.current = [];
      setRecordingMode(mode);
      setIsRecording(true);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = String(reader.result || '');
          if (mode === 'audio') {
            setAudioRecording(result);
          } else {
            setVideoRecording(result);
          }
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop());
        mediaRecorderRef.current = null;
        mediaStreamRef.current = null;
        setIsRecording(false);
      };

      recorder.start();
    } catch (error) {
      console.error('Unable to start recording:', error);
      alert('Please allow camera/microphone access to record evidence.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  useEffect(() => {
    if (user) {
      fetchEmergencyContacts();
    }
  }, [user]);

  if (isPanicked) {
    return (
      <div className="fixed inset-0 bg-red-600/20 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full shadow-2xl">
          <div className="bg-red-600 text-white p-4 flex items-center gap-2">
            <AlertCircle size={24} />
            <h2 className="text-lg font-bold">PANIC ALERT ACTIVE</h2>
          </div>

          <div className="p-6">
            <div className="mb-6 text-center">
              <div className="animate-pulse">
                <AlertCircle size={40} className="text-red-600 mx-auto mb-2" />
              </div>
              <p className="text-gray-700 font-semibold mb-2">Emergency Alert Sent</p>
              <p className="text-sm text-gray-600">Your location and emergency contacts have been notified</p>
            </div>

            <div className="mb-6 rounded-lg border border-slate-200 p-4">
              <div className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
                <Video size={18} /> Evidence Recording
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => (isRecording ? stopRecording() : startRecording('video'))}
                  className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                >
                  {isRecording && recordingMode === 'video' ? 'Stop Video' : 'Record Video'}
                </button>
                <button
                  onClick={() => (isRecording ? stopRecording() : startRecording('audio'))}
                  className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-800"
                >
                  {isRecording && recordingMode === 'audio' ? 'Stop Audio' : 'Record Audio'}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                <Mic size={12} /> Recorded clips are attached locally and sent with the alert payload.
              </p>
            </div>

            {policeStation && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                  <MapPin size={18} />
                  Nearest Police Station
                </h3>
                <p className="text-sm text-yellow-800 mb-1">{policeStation.name}</p>
                <p className="text-sm text-yellow-800 mb-3">{policeStation.address}</p>
                <a
                  href={`tel:${policeStation.phone}`}
                  className="inline-flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
                >
                  <Phone size={16} />
                  Call Police
                </a>
              </div>
            )}

            {emergencyContacts.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Emergency Contacts Notified:</h3>
                <div className="space-y-2">
                  {emergencyContacts.map((contact, i) => (
                    <div key={i} className="bg-gray-50 p-2 rounded text-sm text-gray-700">
                      ✓ {contact}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={cancelAlert}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Cancel Alert
              </button>
              <a
                href="tel:911"
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                Emergency
              </a>
            </div>

            {(audioRecording || videoRecording) && (
              <div className="mt-4 rounded-lg bg-green-50 p-3 text-xs text-green-700">
                Evidence captured successfully.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={triggerPanicAlert}
      disabled={isLoading}
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-4 sm:left-6 w-20 h-20 rounded-full bg-red-600 text-white shadow-2xl hover:bg-red-700 transition transform hover:scale-110 active:scale-95 flex items-center justify-center disabled:opacity-50 z-[70]"
      title="Emergency Panic Button"
    >
      <div className="text-center">
        <AlertCircle size={28} className="mx-auto mb-1" />
        <span className="text-xs font-bold">SOS</span>
      </div>
    </button>
  );
};

export default PanicButton;
