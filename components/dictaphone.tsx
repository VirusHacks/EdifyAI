"use client";
import 'regenerator-runtime/runtime'
import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useRouter } from 'next/navigation';
import { FaMicrophone, FaMicrophoneAltSlash } from 'react-icons/fa';

const Dictaphone = () => {
  const router = useRouter();
  const [listening, setListening] = useState(false);

  const commands = [
    {
      command: 'Go to home',
      callback: () => handleNavigation('/home')
    },
    {
      command: 'Go to course',
      callback: () => handleNavigation('/course-dashboard')
    },
    {
      command: 'Go to Resume ',
      callback: () => handleNavigation('/dashboard')
    },
    {
      command: 'Go to Mock interview  ',
      callback: () => handleNavigation('/mock/dashboard')
    },
    {
      command: 'Go to meeting',
      callback: () => handleNavigation('/meeting-home')
    },
    {
      command: 'Go to lastest hackathons',
      callback: () => handleNavigation('/events')
    },
    {
      command: 'Go to latest meetups',
      callback: () => handleNavigation('/events')
    },
    {
      command: 'Go to lastest internship',
      callback: () => handleNavigation('/internship')
    },
    {
      command: 'stop',
      callback: () => SpeechRecognition.stopListening()
    }
  ];

  const { transcript, listening: isListening, resetTranscript } = useSpeechRecognition({ commands });

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  const handleNavigation = (path) => {
    router.push(path);
    resetTranscript();
    SpeechRecognition.stopListening();
  };

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
    setListening(!listening);
  };

  useEffect(() => {
    return () => {
      SpeechRecognition.stopListening();
    };
  }, []);

  return (
    <div>
      {/* Floating Button with Microphone Icon */}
      <div
        className="fixed bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full shadow-lg cursor-pointer z-50"
        onClick={toggleListening}
        onKeyUp={(e) => { if (e.key === 'Enter') toggleListening(); }}
        // tabIndex={0} // Make the div focusable
      >
        {isListening ? (
          <FaMicrophoneAltSlash size={24} />
        ) : (
          <FaMicrophone size={24} />
        )}
      </div>
    </div>
  );
};

export default Dictaphone;
