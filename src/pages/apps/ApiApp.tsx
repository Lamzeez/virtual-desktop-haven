
import React from 'react';
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ApiAppContent from '@/components/apps/ApiApp';

const ApiAppPage = () => {
  return (
    <div className="min-h-screen bg-desktop-bg flex flex-col">
      <header className="bg-desktop-window p-4 border-b border-white/10 flex items-center">
        <Link to="/">
          <Button variant="outline" size="sm" className="gap-2 text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-white ml-4">API Tools</h1>
      </header>
      
      <main className="flex-1 p-4 overflow-auto">
        <div className="bg-desktop-window rounded-lg p-4 border border-white/10 h-full">
          <ApiAppContent />
        </div>
      </main>
    </div>
  );
};

export default ApiAppPage;
