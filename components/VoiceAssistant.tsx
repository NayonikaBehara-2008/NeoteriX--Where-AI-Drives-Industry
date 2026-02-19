
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Mic, MicOff, Loader2, Globe, Volume2, XCircle, ShieldCheck } from 'lucide-react';

interface VoiceAssistantProps {
  onClose: () => void;
  language?: string;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onClose, language = 'English' }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  const startSession = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            const source = inputContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputContextRef.current!.destination);
          },
          onmessage: async (message) => {
            // Handle transcriptions from both the user and the AI
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setTranscription(prev => prev + '\nUser: ' + text);
            }
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscription(prev => prev + '\nAI: ' + text);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              nextStartTimeRef.current = Math.max(
                nextStartTimeRef.current,
                audioContextRef.current.currentTime
              );
              
              const audioData = decode(base64Audio);
              const buffer = await decodeAudioData(audioData, audioContextRef.current, 24000, 1);
              const source = audioContextRef.current.createBufferSource();
              source.buffer = buffer;
              source.connect(audioContextRef.current.destination);
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error(e);
            setError("Connection failed. Please try again.");
            stopSession();
          },
          onclose: () => {
            setIsActive(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {}, // Enabled input transcription
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          systemInstruction: `You are NeoteriX, an elite, multi-lingual AI Product Assistant for industrial developers. 
          Current user language context: ${language}.
          You are fluent in English, Arabic, Japanese, Chinese, Hindi, Bengali, Korean, Portuguese, Russian, Italian, Dutch, Turkish, Vietnamese, Thai, Indonesian, and many others.
          Provide transcriptions and speech for all these languages natively and accurately.
          Be extremely encouraging, professional, and provide expert industrial feedback. 
          When a developer speaks in their native language (like Arabic), respond appropriately and assist with real-time translation and technical auditing.`
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setError("Microphone access denied or connection error.");
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch (e) {
        console.debug("Session already closed or error closing:", e);
      }
      sessionRef.current = null;
    }

    if (inputContextRef.current && inputContextRef.current.state !== 'closed') {
      try {
        inputContextRef.current.close();
      } catch (e) {
        console.debug("Input context already closed or error closing:", e);
      }
    }
    inputContextRef.current = null;

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {
        console.debug("Output context already closed or error closing:", e);
      }
    }
    audioContextRef.current = null;

    setIsActive(false);
    setIsConnecting(false);
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  function decode(base64: string) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function encode(bytes: Uint8Array) {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, rate: number, channels: number) {
    const int16 = new Int16Array(data.buffer);
    const frameCount = int16.length / channels;
    const buffer = ctx.createBuffer(channels, frameCount, rate);
    for (let c = 0; c < channels; c++) {
      const channelData = buffer.getChannelData(c);
      for (let i = 0; i < channelData.length; i++) {
        channelData[i] = int16[i * channels + c] / 32768.0;
      }
    }
    return buffer;
  }

  function createBlob(data: Float32Array) {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) {
      int16[i] = data[i] * 32768;
    }
    return { 
      data: encode(new Uint8Array(int16.buffer)), 
      mimeType: 'audio/pcm;rate=16000' 
    };
  }

  return (
    <div className="flex flex-col items-center gap-10 py-4">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3 text-indigo-600">
          <Globe className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Industry AI Intelligence</span>
        </div>
        <h3 className="text-3xl font-black text-slate-950 dark:text-white">NeoteriX Voice Assistant</h3>
        <p className="text-slate-500 font-bold max-w-xs mx-auto text-sm leading-relaxed">
          Speak in any language. NeoteriX will translate and help you audit your industrial products in real-time.
        </p>
      </div>

      <div className="relative flex items-center justify-center">
        {isActive && <div className="absolute inset-0 voice-aura scale-150"></div>}
        <button 
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
            isActive ? 'bg-indigo-600 scale-110' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
          }`}
        >
          {isConnecting ? (
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          ) : isActive ? (
            <Volume2 className="w-12 h-12 text-white animate-bounce" />
          ) : (
            <Mic className="w-10 h-10 text-slate-600" />
          )}
        </button>
      </div>

      <div className="w-full space-y-6">
        {error && (
          <div className="bg-rose-50 dark:bg-rose-950 border border-rose-100 dark:border-rose-900 p-5 rounded-3xl flex items-center gap-4 text-rose-700 dark:text-rose-400 text-sm font-bold">
            <XCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}
        
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 min-h-[160px] max-h-[250px] overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Neural Transcription Feed</div>
          <p className="text-slate-900 dark:text-slate-100 font-bold leading-relaxed whitespace-pre-wrap text-sm">
            {isActive ? (transcription || "Listening across multiple frequencies...") : "Initiate neural link to start."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
          <ShieldCheck className="w-3.5 h-3.5" />
          Secure Multilingual Industry Session
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
