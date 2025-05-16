
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MessagingAppPage from "./pages/apps/MessagingApp";
import XmlTransformerAppPage from "./pages/apps/XmlTransformerApp";
import JavaXmlAppPage from "./pages/apps/JavaXmlApp";
import ApiAppPage from "./pages/apps/ApiApp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/apps/messaging" element={<MessagingAppPage />} />
          <Route path="/apps/xml-transformer" element={<XmlTransformerAppPage />} />
          <Route path="/apps/java-xml" element={<JavaXmlAppPage />} />
          <Route path="/apps/api" element={<ApiAppPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
