
import React from 'react';

interface TaskbarItem {
  id: string;
  name: string;
  isActive: boolean;
}

interface TaskbarProps {
  openWindows: TaskbarItem[];
  onWindowSelect: (id: string) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ openWindows, onWindowSelect }) => {
  return (
    <div className="bg-black/40 backdrop-blur-sm h-14 border-t border-white/10 w-full flex items-center justify-center px-4">
      <div className="flex gap-2">
        {openWindows.map(window => (
          <div 
            key={window.id}
            className={`
              px-4 py-2 rounded-md cursor-pointer transition-all duration-200
              ${window.isActive 
                ? 'bg-white/20 text-white' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }
            `}
            onClick={() => onWindowSelect(window.id)}
          >
            {window.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Taskbar;
