
import React, { useRef, useState, useEffect } from 'react';
import { X, Minus, Square } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isActive: boolean;
  onClose: () => void;
  onClick: () => void;
  position: { x: number, y: number };
  onUpdatePosition: (x: number, y: number) => void;
  iconColor?: string;
  icon?: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ 
  id, 
  title, 
  children, 
  isActive, 
  onClose, 
  onClick,
  position,
  onUpdatePosition,
  iconColor,
  icon
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag from the header
    if ((e.target as HTMLElement).closest('.window-body') || 
        (e.target as HTMLElement).closest('.window-controls')) {
      return;
    }
    
    setIsDragging(true);
    
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Handle dragging and dropping
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        onUpdatePosition(newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onUpdatePosition]);

  const zIndex = isActive ? 50 : 10;

  return (
    <div 
      ref={windowRef}
      className={`window absolute ${isActive ? 'shadow-2xl' : 'shadow-lg'}`}
      style={{ 
        minWidth: '500px', 
        minHeight: '400px',
        maxWidth: '800px',
        maxHeight: '600px',
        width: '70vw',
        height: '70vh',
        left: `${position.x}px`, 
        top: `${position.y}px`,
        zIndex
      }}
      onClick={onClick}
    >
      <div 
        className="window-header cursor-move select-none flex items-center justify-between px-4 py-2 bg-desktop-window border-b border-white/10"
        onMouseDown={handleMouseDown}
      >
        <div className="window-controls flex items-center gap-2">
          <div 
            className="window-control bg-red-500 cursor-pointer hover:bg-red-600 w-3 h-3 rounded-full flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="w-2 h-2 text-white opacity-0 group-hover:opacity-100" />
          </div>
          <div className="window-control bg-yellow-500 hover:bg-yellow-600 w-3 h-3 rounded-full">
            <Minus className="w-2 h-2 text-white opacity-0 group-hover:opacity-100" />
          </div>
          <div className="window-control bg-green-500 hover:bg-green-600 w-3 h-3 rounded-full">
            <Square className="w-2 h-2 text-white opacity-0 group-hover:opacity-100" />
          </div>
        </div>
        
        <div className="window-title flex items-center gap-2 text-white">
          {icon && (
            <div className={`${iconColor} p-1 rounded-md w-6 h-6 flex items-center justify-center`}>
              {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4" })}
            </div>
          )}
          <span className="font-medium">{title}</span>
        </div>
        
        <div className="w-16">
          {/* Spacer to center the title */}
        </div>
      </div>
      <div className="window-body p-4 h-[calc(100%-38px)] overflow-auto bg-desktop-window">
        {children}
      </div>
    </div>
  );
};

export default Window;
