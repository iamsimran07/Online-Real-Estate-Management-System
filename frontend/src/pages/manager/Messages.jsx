import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageSquare, Search, Clock, CheckCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const Messages = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const res = await api.get('/messages/contacts');
      setContacts(res.data);
      if (!activeContact && res.data.length > 0) {
        setActiveContact(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load chat contacts', err);
    } finally {
      setLoadingContacts(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Fetch conversation when active contact changes
  const fetchConversation = async (contactId) => {
    if (!contactId) return;
    try {
      const res = await api.get(`/messages/conversation/${contactId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load conversation', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (activeContact) {
      setLoadingMessages(true);
      fetchConversation(activeContact.id);
      const interval = setInterval(() => fetchConversation(activeContact.id), 4000); // Poll live chat every 4s
      return () => clearInterval(interval);
    }
  }, [activeContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContact) return;

    const messageText = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const res = await api.post('/messages', {
        receiverId: activeContact.id,
        content: messageText,
      });
      setMessages((prev) => [...prev, res.data]);
      scrollToBottom();
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Direct Communications</h1>
        <p className="text-xs text-slate-500">Real-time chat with tenants, managers, and system administrators.</p>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Contacts Sidebar */}
        <div className="w-full md:w-80 border-r border-slate-100 flex flex-col shrink-0 bg-slate-50/50">
          <div className="p-4 border-b border-slate-100 bg-white">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Conversations</h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingContacts ? (
              <div className="p-6 text-center text-xs text-slate-400">Loading contacts...</div>
            ) : contacts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                No active conversations yet.
              </div>
            ) : (
              contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setActiveContact(contact)}
                  className={`w-full p-4 flex items-center space-x-3 text-left transition-colors ${
                    activeContact?.id === contact.id
                      ? 'bg-brand-50/80 border-r-2 border-brand-600'
                      : 'hover:bg-slate-100/60'
                  }`}
                >
                  <img
                    src={contact.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                    alt={contact.name}
                    className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">{contact.name}</p>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                      {contact.role?.toLowerCase().replace('_', ' ')}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Thread Panel */}
        <div className="flex-1 flex flex-col bg-white">
          {activeContact ? (
            <>
              {/* Active Header */}
              <div className="p-4 border-b border-slate-100 flex items-center space-x-3 bg-white">
                <img
                  src={activeContact.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                  alt={activeContact.name}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{activeContact.name}</h4>
                  <span className="text-[10px] font-semibold text-brand-600 capitalize">
                    {activeContact.role?.toLowerCase().replace('_', ' ')} • Online
                  </span>
                </div>
              </div>

              {/* Message Bubbles */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
                {loadingMessages ? (
                  <div className="text-center text-xs text-slate-400 py-12">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-xs text-slate-400 py-12">
                    No messages in this conversation yet. Send a greeting to start chatting!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isSelf = msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md sm:max-w-lg rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                            isSelf
                              ? 'bg-gradient-to-r from-brand-600 to-tealbrand-600 text-white rounded-br-none'
                              : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                          }`}
                        >
                          <p>{msg.content}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : ''}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Write a message to ${activeContact.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="p-3 rounded-2xl bg-gradient-to-r from-brand-600 to-tealbrand-500 hover:from-brand-700 hover:to-tealbrand-600 text-white shadow-md disabled:opacity-40 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-600">Select a conversation to start messaging</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Messages;
