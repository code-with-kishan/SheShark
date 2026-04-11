import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useStore } from '../../store/useStore';
import { languageLabels, useVoiceAssistant, type VoiceLanguageMode } from '../../hooks/useVoiceAssistant';

interface VoiceAssistantProps {
  onCommandExecute?: (command: string) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onCommandExecute }) => {
  const { language, voiceEnabled, audioEnabled, audioVolume, setAudioVolume } = useStore();
  const navigate = useNavigate();
  const initialMode: VoiceLanguageMode = language === 'hi' ? 'hi' : 'auto';

  const voiceAssistant = useVoiceAssistant({
    initialLanguageMode: initialMode,
    speechEnabled: audioEnabled,
    speechVolume: audioVolume,
    onCommand: (result) => {
      navigate(result.route);
      onCommandExecute?.(result.route);
    },
  });

  if (!voiceAssistant.isSupported) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">Voice Assistant is not supported in your browser</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Mic size={20} className="text-pink-500" />
        Voice Assistant
      </h3>

      <div className="mb-4 flex flex-wrap gap-2">
        {(['auto', 'en', 'hi'] as VoiceLanguageMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => voiceAssistant.setLanguageMode(mode)}
            className={clsx(
              'rounded-full px-3 py-1 text-xs font-semibold transition',
              voiceAssistant.languageMode === mode
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {languageLabels[mode]}
          </button>
        ))}
      </div>

      {/* Listening Status */}
      <div
        className={clsx(
          'p-4 rounded-lg mb-4 text-center',
          voiceAssistant.isListening ? 'bg-pink-50 border border-pink-300' : 'bg-gray-50 border border-gray-300'
        )}
      >
        {voiceAssistant.isListening ? (
          <div>
            <div className="flex justify-center mb-2">
              <div className="animate-pulse">
                <Mic size={24} className="text-pink-500" />
              </div>
            </div>
            <p className="text-sm font-medium text-pink-700">Listening...</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600">Ready to listen</p>
            <p className="mt-1 text-xs text-gray-500">Mode: {languageLabels[voiceAssistant.languageMode]}</p>
          </div>
        )}
      </div>

      {/* Transcript Display */}
      {voiceAssistant.transcript && (
        <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">You said:</span> {voiceAssistant.transcript}
          </p>
        </div>
      )}

      {/* Response Display */}
      {voiceAssistant.response && (
        <div className="mb-4 p-3 bg-green-50 rounded border border-green-200">
          <p className="text-sm text-gray-700">{voiceAssistant.response}</p>
        </div>
      )}

      {voiceAssistant.error && (
        <div className="mb-4 p-3 bg-red-50 rounded border border-red-200">
          <p className="text-sm text-red-700">{voiceAssistant.error}</p>
        </div>
      )}

      {!voiceEnabled && (
        <div className="mb-4 p-3 bg-amber-50 rounded border border-amber-200">
          <p className="text-sm text-amber-700">Voice commands are turned off. Enable voice to start listening.</p>
        </div>
      )}

      {!audioEnabled && (
        <div className="mb-4 p-3 bg-amber-50 rounded border border-amber-200">
          <p className="text-sm text-amber-700">Audio is turned off. Enable audio for spoken responses.</p>
        </div>
      )}

      <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
          <span>Voice volume</span>
          <span>{Math.round(audioVolume * 100)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={Math.round(audioVolume * 100)}
          onChange={(event) => setAudioVolume(Number(event.target.value) / 100)}
          className="w-full accent-pink-500"
          aria-label="Adjust voice volume"
        />
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={voiceAssistant.toggleListening}
          disabled={!voiceAssistant.isSupported || !voiceEnabled}
          className="flex-1 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 disabled:bg-gray-400 transition flex items-center justify-center gap-2"
        >
          <Mic size={16} />
          {voiceAssistant.isListening ? 'Stop Listening' : 'Start Listening'}
        </button>

        <button
          onClick={voiceAssistant.stopListening}
          disabled={!voiceAssistant.isListening}
          className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition flex items-center justify-center gap-2"
        >
          <MicOff size={16} />
          Stop
        </button>
      </div>

      <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
        Voice commands auto-submit after you finish speaking.
      </div>

      {/* Voice Feedback */}
      <button
        onClick={() => void voiceAssistant.speak(voiceAssistant.response || 'Hello from SheShark')}
        disabled={!audioEnabled || !voiceAssistant.canSpeak}
        className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 disabled:bg-gray-400 transition flex items-center justify-center gap-2"
      >
        <Volume2 size={16} />
        Speak Response
      </button>

      {/* Help Text */}
      <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
        <p className="font-semibold mb-2">Try saying:</p>
        <ul className="text-xs space-y-1">
          <li>• "Open marketplace"</li>
          <li>• "Safety section kholo"</li>
          <li>• "Dashboard"</li>
          <li>• "Profile kholo"</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceAssistant;
 
