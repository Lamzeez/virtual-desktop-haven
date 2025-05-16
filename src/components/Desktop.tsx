
import React, { useState } from 'react';
import { MessageSquare, FileCode, FileText, Terminal } from 'lucide-react';
import Window from './Window';
import MessagingApp from './apps/MessagingApp';
import XmlTransformerApp from './apps/XmlTransformerApp';
import JavaXmlApp from './apps/JavaXmlApp';
import ApiApp from './apps/ApiApp';
import Taskbar from './Taskbar';
import { useToast } from '@/hooks/use-toast';

interface DesktopIcon {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  component: React.ReactNode;
  description: string;
}

const Desktop: React.FC = () => {
  const { toast } = useToast();
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [windowPositions, setWindowPositions] = useState<Record<string, { x: number, y: number }>>({});

  const desktopIcons: DesktopIcon[] = [
    {
      id: 'messaging',
      name: 'Messaging App',
      icon: <MessageSquare className="w-10 h-10" />,
      color: 'bg-desktop-icon-messaging',
      component: <MessagingApp />,
      description: 'Messaging system with RabbitMQ integration'
    },
    {
      id: 'xml-transformer',
      name: 'XML Transformer',
      icon: <FileCode className="w-10 h-10" />,
      color: 'bg-desktop-icon-xml',
      component: <XmlTransformerApp />,
      description: 'Transform XML with XSLT stylesheets'
    },
    {
      id: 'java-xml',
      name: 'Java XML Parser',
      icon: <FileText className="w-10 h-10" />,
      color: 'bg-desktop-icon-java',
      component: <JavaXmlApp />,
      description: 'Parse XML files using Java'
    },
    {
      id: 'api',
      name: 'API Tool',
      icon: <Terminal className="w-10 h-10" />,
      color: 'bg-desktop-icon-api',
      component: <ApiApp />,
      description: 'Execute API requests and Bash scripts'
    }
  ];

  const handleOpenWindow = (id: string) => {
    if (!openWindows.includes(id)) {
      setOpenWindows(prev => [...prev, id]);
      
      // Set a slightly random position for new windows
      const randomOffset = Math.floor(Math.random() * 50);
      setWindowPositions(prev => ({
        ...prev,
        [id]: { x: 100 + randomOffset, y: 80 + randomOffset }
      }));
      
      toast({
        title: "Opening Application",
        description: `Launching ${desktopIcons.find(icon => icon.id === id)?.name}`,
      });
    }
    setActiveWindow(id);
  };

  const handleCloseWindow = (id: string) => {
    setOpenWindows(prev => prev.filter(windowId => windowId !== id));
    if (activeWindow === id) {
      setActiveWindow(openWindows.filter(windowId => windowId !== id)[0] || null);
    }
  };

  const handleWindowClick = (id: string) => {
    setActiveWindow(id);
  };

  const handleUpdatePosition = (id: string, x: number, y: number) => {
    setWindowPositions(prev => ({
      ...prev,
      [id]: { x, y }
    }));
  };

  return (
    <div className="relative w-full h-[600px] bg-desktop-bg overflow-hidden flex flex-col rounded-xl shadow-2xl border border-white/5">
      <div className="flex-1 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 content-start">
        {desktopIcons.map(icon => (
          <div 
            key={icon.id} 
            className="desktop-icon hover:scale-105 transition-transform"
            onClick={() => handleOpenWindow(icon.id)}
          >
            <div className={`desktop-icon-wrapper ${icon.color} rounded-2xl flex items-center justify-center shadow-lg`}>
              {icon.icon}
            </div>
            <span className="text-white text-sm font-medium mt-2">{icon.name}</span>
            <span className="text-gray-400 text-xs">{icon.description}</span>
          </div>
        ))}
      </div>

      {/* Application Windows */}
      {openWindows.map(windowId => {
        const app = desktopIcons.find(icon => icon.id === windowId);
        const position = windowPositions[windowId] || { x: 100, y: 80 };
        
        return app ? (
          <Window
            key={windowId}
            id={windowId}
            title={app.name}
            isActive={activeWindow === windowId}
            onClose={() => handleCloseWindow(windowId)}
            onClick={() => handleWindowClick(windowId)}
            position={position}
            onUpdatePosition={(x, y) => handleUpdatePosition(windowId, x, y)}
            iconColor={app.color}
            icon={app.icon}
          >
            {app.component}
          </Window>
        ) : null;
      })}

      <Taskbar 
        openWindows={openWindows.map(id => ({
          id,
          name: desktopIcons.find(icon => icon.id === id)?.name || '',
          isActive: id === activeWindow,
          icon: desktopIcons.find(icon => icon.id === id)?.icon,
          color: desktopIcons.find(icon => icon.id === id)?.color || ''
        }))}
        onWindowSelect={handleWindowClick}
      />
    </div>
  );
};

export default Desktop;
