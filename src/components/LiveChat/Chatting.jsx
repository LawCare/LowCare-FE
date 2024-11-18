import React, { useState, useEffect } from 'react';
import { TRANSLATIONS, LANGUAGES, LANGUAGE_LABELS, HEADER_MESSAGE, INITIAL_GREETING } from './ChatData';
import { Smile } from 'lucide-react';
import Image from 'next/image';
import addIcon from '@/assets/icons/addition.png';
import send from '@/assets/icons/send.png';
import Aa from '@/assets/icons/Aa.png';

const Chatting = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [sourceLang, setSourceLang] = useState('ko');
  const [targetLang, setTargetLang] = useState('zh');
  const [dummyIndex, setDummyIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeInputTab, setActiveInputTab] = useState('chat');
  const [isKorean, setIsKorean] = useState(true);

  const languages = {
    ko: '한국어',
    zh: '중국어',
    vi: '베트남어',
    th: '태국어'
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([
        {
          id: 0,
          sender: 'admin',
          messages: {
            ko: INITIAL_GREETING.ko || INITIAL_GREETING,
            zh: INITIAL_GREETING.zh || INITIAL_GREETING,
            vi: INITIAL_GREETING.vi || INITIAL_GREETING,
            th: INITIAL_GREETING.th || INITIAL_GREETING
          },
          timestamp: new Date(),
          type: 'chat'
        }
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  const findMatchingResponse = (text) => {
    const keywords = Object.keys(TRANSLATIONS.counselor);
    const matchedKeyword = keywords.find((keyword) => text.includes(keyword));
    return TRANSLATIONS.counselor[matchedKeyword] || TRANSLATIONS.counselor['default'];
  };

  const handleSendMessage = () => {
    const textToSend = activeInputTab === 'chat' ? inputText : noteText;

    if (!textToSend.trim() && dummyIndex >= TRANSLATIONS.worker.length) {
      setDummyIndex(0);
      return;
    }

    let messageToSend;
    if (textToSend.trim()) {
      messageToSend = {
        ko: textToSend,
        zh: textToSend,
        vi: textToSend,
        th: textToSend
      };
    } else {
      messageToSend = {
        ko: TRANSLATIONS.worker[dummyIndex].ko,
        zh: TRANSLATIONS.worker[dummyIndex].zh,
        vi: TRANSLATIONS.worker[dummyIndex].vi,
        th: TRANSLATIONS.worker[dummyIndex].th
      };
      setDummyIndex((prevIndex) => (prevIndex + 1) % TRANSLATIONS.worker.length);
    }

    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      messages: messageToSend,
      timestamp: new Date(),
      type: activeInputTab
    };

    setMessages([...messages, newMessage]);

    if (activeInputTab === 'chat') {
      setInputText('');
    } else {
      setNoteText('');
    }

    if (activeInputTab === 'chat') {
      const response = findMatchingResponse(messageToSend.ko);
      setTimeout(() => {
        const autoResponse = {
          id: messages.length + 2,
          sender: 'admin',
          messages: response,
          timestamp: new Date(),
          type: 'chat'
        };
        setMessages((prev) => [...prev, autoResponse]);
      }, 1000);
    }
  };

  const handleToggleLanguage = () => {
    setIsKorean(!isKorean);
  };

  const handleFileUpload = () => {
    console.log('File upload clicked');
  };

  const handleEmojiClick = () => {
    console.log('Emoji clicked');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 언어 선택 영역*/}
      <div className="max-w-xl mx-auto p-4">
        <div className=" items-center space-x-2">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="flex-1 p-2 rounded-s border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(languages).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>

          <button onClick={handleSwap} className="p-2 rounded-full hover:bg-gray-100" aria-label="Swap languages">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 7h12M8 7l4-4M8 7l4 4m4 4H4m16 0l-4-4m4 4l-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="flex-1 p-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(languages).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-2 text-center text-sm text-gray-600">
          {languages[sourceLang]} - {languages[targetLang]}
        </div>
      </div>

      <div className="flex-none p-4">
        <div className="text-center space-y-1">
          <p className="text-gray-500 text-sm">{HEADER_MESSAGE.ko}</p>
          <p className="text-gray-400 text-sm">{HEADER_MESSAGE[targetLang]}</p>
        </div>
      </div>

      <div className="flex flex-col h-[calc(104vh-400px)]">
        {/* 채팅 표시 영역 - 스크롤 가능 */}
        <div className="flex-1 overflow-y-auto px-4 space-y-4 min-h-[400px] max-h-[600px]">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-md p-3 rounded-lg ${
                  message.sender === 'user'
                    ? message.type === 'chat'
                      ? 'bg-blue-100'
                      : 'bg-green-100'
                    : 'bg-white border'
                }`}
              >
                <div className="space-y-2">
                  <p className="break-words text-gray-900">{message.messages[sourceLang]}</p>
                  {message.type === 'chat' && targetLang !== sourceLang && (
                    <p className="break-words text-gray-600 border-t pt-2">{message.messages[targetLang]}</p>
                  )}
                </div>
              </div>
              {/* <div className="text-xs text-gray-400 mt-2 self-end">{message.timestamp.toLocaleTimeString()}</div> */}
            </div>
          ))}
        </div>

        <div className="flex-none"></div>
      </div>

      <div className="flex-none border-t bg-white">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 text-sm ${
              activeInputTab === 'chat' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
            }`}
            onClick={() => setActiveInputTab('chat')}
          >
            채팅
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <button
                onClick={handleFileUpload}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded"
                disabled={isLoading}
                title="파일 첨부"
              >
                <Image src={addIcon} alt="addfile" width={20} height={20} />
              </button>
              <button
                onClick={handleEmojiClick}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded"
                disabled={isLoading}
                title="이모티콘"
              >
                <Smile size={20} />
              </button>
              <button
                onClick={handleToggleLanguage}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded"
                disabled={isLoading}
                title="한/영 전환"
              >
                <span className="ml-1 text-sm">{isKorean ? '한' : 'A'}</span>
              </button>
            </div>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              placeholder="메시지를 입력하세요..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg disabled:text-gray-300"
              disabled={isLoading || (!inputText.trim() && !noteText.trim())}
              title="전송"
            >
              <Image src={send} alt="send" width={30} height={30} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatting;
