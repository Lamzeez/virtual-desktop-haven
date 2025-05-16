
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const MessagingApp: React.FC = () => {
  const { toast } = useToast();
  const [userType, setUserType] = useState<'publisher' | 'subscriber' | 'admin' | null>(null);
  const [messages, setMessages] = useState<{sender: string, content: string, time: string}[]>([
    {sender: 'System', content: 'Welcome to the Messaging App', time: '10:00 AM'}
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [channelName, setChannelName] = useState('general');
  const [queueStatus, setQueueStatus] = useState([
    {name: 'general', messages: 7, status: 'active'},
    {name: 'support', messages: 3, status: 'active'},
    {name: 'alerts', messages: 0, status: 'idle'}
  ]);

  const handleLogin = (type: 'publisher' | 'subscriber' | 'admin') => {
    setUserType(type);
    toast({
      title: "Logged in",
      description: `You are now logged in as a ${type}`,
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    setMessages(prev => [...prev, {
      sender: userType === 'publisher' ? 'You (Publisher)' : 'You',
      content: newMessage,
      time: timeString
    }]);
    
    setNewMessage('');
    
    // Simulate response after a delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: 'System',
        content: `Message received in queue "${channelName}"`,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
    }, 1000);
  };

  const handleCreateQueue = () => {
    setQueueStatus(prev => [
      ...prev, 
      {name: `new-queue-${Math.floor(Math.random() * 1000)}`, messages: 0, status: 'active'}
    ]);
    
    toast({
      title: "Queue Created",
      description: "New message queue has been created",
    });
  };

  if (!userType) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-semibold mb-6 text-white">Select User Type</h2>
        <div className="flex gap-4">
          <Button onClick={() => handleLogin('publisher')} variant="outline">Publisher</Button>
          <Button onClick={() => handleLogin('subscriber')} variant="outline">Subscriber</Button>
          <Button onClick={() => handleLogin('admin')} variant="outline">Admin</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full text-white">
      <Tabs defaultValue={userType === 'admin' ? 'admin' : 'chat'} className="flex flex-col h-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" disabled={userType === 'admin'}>Chat</TabsTrigger>
          <TabsTrigger value="pubsub" disabled={userType === 'admin'}>Pub/Sub</TabsTrigger>
          <TabsTrigger value="admin" disabled={userType !== 'admin'}>Admin</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 flex flex-col">
          <div className="mb-4 p-2 bg-black/20 rounded-md">
            <h3 className="font-medium">Point-to-Point Chat</h3>
            <p className="text-xs text-gray-300">Direct messaging using RabbitMQ queues</p>
          </div>
          
          <div className="flex-1 overflow-auto mb-4 bg-black/10 rounded-md p-2">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{msg.sender}</span>
                  <span>{msg.time}</span>
                </div>
                <p className="bg-black/20 p-2 rounded-md">{msg.content}</p>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="pubsub" className="flex-1 flex flex-col">
          <div className="mb-4 p-2 bg-black/20 rounded-md">
            <h3 className="font-medium">Publish/Subscribe System</h3>
            <p className="text-xs text-gray-300">Broadcast messages to multiple subscribers</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Channel</h4>
              <select 
                className="w-full p-2 rounded-md bg-black/20 border border-white/20"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              >
                <option value="general">general</option>
                <option value="announcements">announcements</option>
                <option value="support">support</option>
              </select>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Message Type</h4>
              <select className="w-full p-2 rounded-md bg-black/20 border border-white/20">
                <option value="text">Text</option>
                <option value="notification">Notification</option>
                <option value="alert">Alert</option>
              </select>
            </div>
          </div>
          
          <div className="flex-1 mb-4">
            <h4 className="text-sm font-medium mb-2">Message Content</h4>
            <Textarea 
              placeholder="Type your broadcast message..."
              className="h-32"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </div>
          
          <Button onClick={handleSendMessage}>
            {userType === 'publisher' ? 'Publish Message' : 'Subscribe to Channel'}
          </Button>
        </TabsContent>
        
        <TabsContent value="admin" className="flex-1">
          <div className="mb-4 p-2 bg-black/20 rounded-md">
            <h3 className="font-medium">Admin Dashboard</h3>
            <p className="text-xs text-gray-300">Monitor and manage RabbitMQ queues</p>
          </div>
          
          <div className="mb-4">
            <Button onClick={handleCreateQueue} variant="outline" size="sm">
              Create New Queue
            </Button>
          </div>
          
          <div className="overflow-auto bg-black/10 rounded-md">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-2 text-left">Queue Name</th>
                  <th className="p-2 text-right">Messages</th>
                  <th className="p-2 text-right">Status</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {queueStatus.map((queue, index) => (
                  <tr key={index} className="border-b border-white/10">
                    <td className="p-2">{queue.name}</td>
                    <td className="p-2 text-right">{queue.messages}</td>
                    <td className="p-2 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        queue.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {queue.status}
                      </span>
                    </td>
                    <td className="p-2 text-right">
                      <Button variant="ghost" size="sm">Purge</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MessagingApp;
