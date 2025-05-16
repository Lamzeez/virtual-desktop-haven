
import React, { useRef, useState, useEffect } from 'react';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isActive: boolean;
  onClose: () => void;
  onClick: () => void;
  position: { x: number, y: number };
  onUpdatePosition: (x: number, y: number) => void;
}

const Window: React.FC<WindowProps> = ({ 
  id, 
  title, 
  children, 
  isActive, 
  onClose, 
  onClick,
  position,
  onUpdatePosition
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag from the header
    if ((e.target as HTMLElement).closest('.window-body')) {
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
        className="window-header cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="window-controls">
          <div 
            className="window-control bg-red-500 cursor-pointer hover:bg-red-600" 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          />
          <div className="window-control bg-yellow-500" />
          <div className="window-control bg-green-500" />
        </div>
        <div className="window-title">{title}</div>
        <div className="w-16">
          {/* Spacer to center the title */}
        </div>
      </div>
      <div className="window-body">
        {children}
      </div>
    </div>
  );
};

export default Window;
