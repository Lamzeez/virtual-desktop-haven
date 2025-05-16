
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { MessageSquare, Users, User, PlusCircle } from "lucide-react";

interface MessageType {
  sender: string;
  content: string;
  time: string;
}

interface UserType {
  id: string;
  username: string;
  role: 'publisher' | 'subscriber' | 'admin';
}

interface Channel {
  id: string;
  name: string;
  creatorId: string;
  subscribers: string[];
  messages: MessageType[];
}

const MessagingApp: React.FC = () => {
  const { toast } = useToast();
  
  // User state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<UserType[]>([
    { id: '1', username: 'admin', role: 'admin' },
    { id: '2', username: 'publisher1', role: 'publisher' },
    { id: '3', username: 'subscriber1', role: 'subscriber' }
  ]);

  // Messaging state
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  
  // Channel state
  const [channels, setChannels] = useState<Channel[]>([
    { 
      id: 'general', 
      name: 'General Announcements', 
      creatorId: '1',
      subscribers: ['1', '2', '3'],
      messages: [
        { sender: 'System', content: 'Welcome to the General channel', time: '10:00 AM' }
      ]
    }
  ]);
  const [newChannelName, setNewChannelName] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  const handleLogin = (role: 'publisher' | 'subscriber' | 'admin') => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive"
      });
      return;
    }

    const userId = `user-${Date.now()}`;
    const newUser = { id: userId, username, role };
    
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    
    toast({
      title: "Logged in",
      description: `You are now logged in as ${username} (${role})`,
    });
  };

  const handleSendDirectMessage = () => {
    if (!newMessage.trim() || !selectedChat || !currentUser) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const newMsg = {
      sender: currentUser.username,
      content: newMessage,
      time: timeString
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    
    // Simulate response after a delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: users.find(u => u.id === selectedChat)?.username || 'User',
        content: `Thanks for your message, ${currentUser.username}!`,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
    }, 1000);
  };

  const handleCreateChannel = () => {
    if (!newChannelName.trim() || !currentUser) return;
    
    if (currentUser.role !== 'publisher' && currentUser.role !== 'admin') {
      toast({
        title: "Permission Denied",
        description: "Only publishers and admins can create channels",
        variant: "destructive"
      });
      return;
    }
    
    const channelId = `channel-${Date.now()}`;
    const newChannel = {
      id: channelId,
      name: newChannelName,
      creatorId: currentUser.id,
      subscribers: [currentUser.id],
      messages: []
    };
    
    setChannels(prev => [...prev, newChannel]);
    setNewChannelName('');
    setSelectedChannel(channelId);
    
    toast({
      title: "Channel Created",
      description: `Channel "${newChannelName}" has been created`,
    });
  };

  const handlePublishToChannel = () => {
    if (!newMessage.trim() || !selectedChannel || !currentUser) return;
    
    const channel = channels.find(c => c.id === selectedChannel);
    if (!channel) return;
    
    if (channel.creatorId !== currentUser.id && currentUser.role !== 'admin') {
      toast({
        title: "Permission Denied",
        description: "Only the channel creator can publish messages",
        variant: "destructive"
      });
      return;
    }
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const newMsg = {
      sender: currentUser.username,
      content: newMessage,
      time: timeString
    };
    
    setChannels(prev => prev.map(c => {
      if (c.id === selectedChannel) {
        return {
          ...c,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));
    
    setNewMessage('');
    
    toast({
      title: "Message Published",
      description: `Message published to "${channel.name}"`,
    });
  };

  const handleSubscribeToChannel = (channelId: string) => {
    if (!currentUser) return;
    
    setChannels(prev => prev.map(c => {
      if (c.id === channelId && !c.subscribers.includes(currentUser.id)) {
        return {
          ...c,
          subscribers: [...c.subscribers, currentUser.id]
        };
      }
      return c;
    }));
    
    toast({
      title: "Subscribed",
      description: `You have subscribed to "${channels.find(c => c.id === channelId)?.name}"`,
    });
  };

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-md bg-desktop-window text-white border-white/10">
          <CardHeader>
            <CardTitle>Welcome to ProgDesk Messaging</CardTitle>
            <CardDescription className="text-gray-300">
              Register to start messaging with other users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="username">Username</label>
                <Input 
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter a username"
                  className="bg-black/20 border-white/20"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Select User Type</label>
                <div className="grid grid-cols-3 gap-4">
                  <Button 
                    onClick={() => handleLogin('publisher')} 
                    variant="outline"
                    className="flex flex-col items-center gap-2 p-4 h-auto"
                  >
                    <MessageSquare className="h-6 w-6" />
                    <span>Publisher</span>
                  </Button>
                  <Button 
                    onClick={() => handleLogin('subscriber')} 
                    variant="outline"
                    className="flex flex-col items-center gap-2 p-4 h-auto"
                  >
                    <Users className="h-6 w-6" />
                    <span>Subscriber</span>
                  </Button>
                  <Button 
                    onClick={() => handleLogin('admin')} 
                    variant="outline"
                    className="flex flex-col items-center gap-2 p-4 h-auto"
                  >
                    <User className="h-6 w-6" />
                    <span>Admin</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-gray-400">
              * Publishers can create channels and send messages<br />
              * Subscribers can receive messages and join channels<br />
              * Admins can manage all channels and users
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Main app after login
  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl font-semibold">ProgDesk Messaging</h2>
          <p className="text-sm text-gray-400">Logged in as {currentUser?.username} ({currentUser?.role})</p>
        </div>
      </div>

      <Tabs defaultValue="direct" className="flex flex-col h-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="direct">Direct Messages</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>
        
        {/* Direct Messages Tab */}
        <TabsContent value="direct" className="flex-1 flex flex-col space-y-4">
          <div className="grid grid-cols-3 gap-4 h-full">
            <div className="col-span-1 bg-black/20 rounded-md p-3 flex flex-col">
              <h3 className="font-medium mb-2 text-sm">Users</h3>
              <div className="flex-1 space-y-1 overflow-auto">
                {users.filter(u => u.id !== currentUser?.id).map((user) => (
                  <Button
                    key={user.id}
                    variant="ghost"
                    className={`justify-start w-full ${selectedChat === user.id ? 'bg-white/10' : ''}`}
                    onClick={() => setSelectedChat(user.id)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span>{user.username}</span>
                    <span className="ml-auto text-xs opacity-70">({user.role})</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="col-span-2 bg-black/20 rounded-md p-3 flex flex-col">
              {selectedChat ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">
                      Chat with {users.find(u => u.id === selectedChat)?.username}
                    </h3>
                  </div>
                  
                  <div className="flex-1 overflow-auto mb-3 bg-black/10 rounded-md p-2">
                    {messages.length > 0 ? (
                      messages.map((msg, idx) => (
                        <div key={idx} className="mb-2">
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{msg.sender}</span>
                            <span>{msg.time}</span>
                          </div>
                          <p className="bg-black/20 p-2 rounded-md">{msg.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        Start a conversation
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 bg-black/20 border-white/20"
                    />
                    <Button onClick={handleSendDirectMessage}>Send</Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Select a user to start chatting
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Channels Tab */}
        <TabsContent value="channels" className="flex-1 flex flex-col space-y-4">
          <div className="grid grid-cols-3 gap-4 h-full">
            <div className="col-span-1 bg-black/20 rounded-md p-3 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-sm">Channels</h3>
                {(currentUser?.role === 'publisher' || currentUser?.role === 'admin') && (
                  <Button size="sm" variant="ghost" onClick={() => setSelectedChannel('new')} className="h-7 px-2">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex-1 space-y-1 overflow-auto">
                {channels.map((channel) => {
                  const isSubscribed = channel.subscribers.includes(currentUser?.id || '');
                  const isCreator = channel.creatorId === currentUser?.id;
                  
                  return (
                    <Button
                      key={channel.id}
                      variant="ghost"
                      className={`justify-start w-full ${selectedChannel === channel.id ? 'bg-white/10' : ''}`}
                      onClick={() => setSelectedChannel(channel.id)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      <span>{channel.name}</span>
                      {isCreator && (
                        <span className="ml-auto text-xs text-desktop-icon-messaging">Owner</span>
                      )}
                      {!isSubscribed && !isCreator && (
                        <span className="ml-auto text-xs opacity-70">Not subscribed</span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
            
            <div className="col-span-2 bg-black/20 rounded-md p-3 flex flex-col">
              {selectedChannel === 'new' ? (
                <div className="space-y-4">
                  <h3 className="font-medium">Create New Channel</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm">Channel Name</label>
                    <Input
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                      placeholder="Enter channel name"
                      className="bg-black/20 border-white/20"
                    />
                  </div>
                  
                  <Button onClick={handleCreateChannel}>
                    Create Channel
                  </Button>
                </div>
              ) : selectedChannel ? (
                <>
                  {(() => {
                    const channel = channels.find(c => c.id === selectedChannel);
                    if (!channel) return null;
                    
                    const isSubscribed = channel.subscribers.includes(currentUser?.id || '');
                    const isCreator = channel.creatorId === currentUser?.id;
                    
                    return (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{channel.name}</h3>
                          {!isSubscribed && !isCreator && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleSubscribeToChannel(channel.id)}
                            >
                              Subscribe
                            </Button>
                          )}
                          {isCreator && (
                            <span className="text-xs bg-desktop-icon-messaging/20 text-desktop-icon-messaging px-2 py-1 rounded">
                              Creator
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-1 overflow-auto mb-3 bg-black/10 rounded-md p-2">
                          {channel.messages.length > 0 ? (
                            channel.messages.map((msg, idx) => (
                              <div key={idx} className="mb-2">
                                <div className="flex justify-between text-xs text-gray-400">
                                  <span>{msg.sender}</span>
                                  <span>{msg.time}</span>
                                </div>
                                <p className="bg-black/20 p-2 rounded-md">{msg.content}</p>
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              No messages in this channel yet
                            </div>
                          )}
                        </div>
                        
                        {(isCreator || currentUser?.role === 'admin') && (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Type your message..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              className="flex-1 bg-black/20 border-white/20"
                            />
                            <Button onClick={handlePublishToChannel}>Publish</Button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Select a channel to view messages
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MessagingApp;
