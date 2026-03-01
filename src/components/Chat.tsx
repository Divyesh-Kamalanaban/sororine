'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';

interface Message {
    id: string;
    senderId: string;
    content: string;
    createdAt: string;
}

interface ChatProps {
    myId: string;
    partnerId: string;
    partnerName?: string;
    onClose?: () => void;
}

export default function Chat({ myId, partnerId, partnerName = "Helper", onClose }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Poll messages
    useEffect(() => {
        let isMounted = true;
        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/messages?user1=${myId}&user2=${partnerId}`);
                const data = await res.json();
                if (isMounted && data.messages) {
                    setMessages(data.messages);
                }
            } catch (e) {
                console.error("Chat poll error", e);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 2000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [myId, partnerId]);

    // Auto-scroll on new messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || isSending) return;

        const tempId = Date.now().toString();
        const optimisticMsg = {
            id: tempId,
            senderId: myId,
            content: inputText,
            createdAt: new Date().toISOString()
        };

        // UI Optimism
        setMessages(prev => [...prev, optimisticMsg]);
        const tempInput = inputText;
        setInputText("");
        setIsSending(true);

        try {
            await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderId: myId,
                    receiverId: partnerId,
                    content: optimisticMsg.content
                })
            });
        } catch (e) {
            console.error("Send failed", e);
            setMessages(prev => prev.filter(m => m.id !== tempId));
            setInputText(tempInput);
        } finally {
            setIsSending(false);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="fixed bottom-0 right-0 md:bottom-4 md:right-4 w-full md:w-96 h-screen md:h-[600px] md:rounded-2xl flex flex-col z-[1000] animate-in slide-in-from-bottom fade-in duration-300 md:shadow-2xl md:border md:border-white/10 bg-[#050509]">
            {/* Header - Modern Gradient */}
            <div className="px-4 md:px-6 py-4 md:py-5 bg-gradient-to-r from-[#2E2BAC] via-[#3D3ABD] to-[#4a47c9] rounded-none md:rounded-t-2xl flex justify-between items-center shadow-lg relative overflow-hidden">
                {/* Animated Background Blur */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-none md:rounded-t-2xl"></div>
                
                <div className="relative z-10 font-bold flex items-center gap-3">
                    <div className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white text-sm md:text-base">{partnerName}</span>
                        <span className="text-green-300 text-xs font-normal">Active now</span>
                    </div>
                </div>
                {onClose && (
                    <button 
                        onClick={onClose} 
                        className="relative z-10 p-2 hover:bg-white/20 rounded-lg transition-all duration-200 text-white ml-2"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Messages Container - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#050509] custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                            </div>
                            <p className="text-white/40 text-sm">No messages yet<br/>Start the conversation...</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.senderId === myId;
                        const showAvatar = idx === 0 || messages[idx - 1].senderId !== msg.senderId;
                        
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
                                {!isMe && showAvatar && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                                        {partnerName.charAt(0)}
                                    </div>
                                )}
                                {!isMe && !showAvatar && (
                                    <div className="w-8"></div>
                                )}
                                
                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%] md:max-w-[75%]`}>
                                    <div
                                        className={`px-4 py-3 rounded-2xl text-sm md:text-base leading-relaxed shadow-lg transition-all duration-200 ${
                                            isMe
                                                ? 'bg-gradient-to-r from-[#2E2BAC] to-[#4a47c9] text-white rounded-br-none'
                                                : 'bg-white/10 text-white border border-white/20 rounded-bl-none backdrop-blur-sm hover:bg-white/15'
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                    <span className="text-xs text-white/40 mt-1 px-2">
                                        {formatTime(msg.createdAt)}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Modern Design */}
            <div className="p-3 md:p-4 bg-[#0A0A10]/80 border-t border-white/10 rounded-none md:rounded-b-2xl backdrop-blur-sm">
                <form onSubmit={handleSend} className="flex gap-2 md:gap-3 items-end">
                    <input
                        type="text"
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        placeholder="Type a message..."
                        maxLength={500}
                        className="flex-1 px-4 py-2.5 md:py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-full focus:outline-none focus:border-[#2E2BAC] focus:ring-2 focus:ring-[#2E2BAC]/30 transition-all duration-200 text-sm md:text-base backdrop-blur-sm"
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim() || isSending}
                        className="p-2.5 md:p-3 bg-gradient-to-r from-[#2E2BAC] to-[#4a47c9] text-white rounded-full hover:from-[#3D3ABD] hover:to-[#5552d6] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center flex-shrink-0 shadow-lg hover:shadow-xl hover:shadow-[#2E2BAC]/30 disabled:shadow-none"
                    >
                        {isSending ? (
                            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                        ) : (
                            <Send size={18} />
                        )}
                    </button>
                </form>
                <p className="text-xs text-white/30 mt-2 px-2">
                    {inputText.length}/500
                </p>
            </div>
        </div>
    );
}
