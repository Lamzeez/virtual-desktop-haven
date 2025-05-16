
import { ArrowDown, Code, Github, Terminal, MessageSquare, FileCode, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-desktop-bg to-desktop-window py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">ProgDesk</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            A powerful web-based programming environment that simulates a desktop operating system for developers.
          </p>
          <div className="flex justify-center gap-4 mb-10">
            <Button variant="default" className="gap-2 bg-white text-desktop-bg hover:bg-gray-200">
              <Github className="w-5 h-5" />
              <span>View on GitHub</span>
            </Button>
            <Button className="bg-desktop-icon-xml hover:bg-desktop-icon-xml/90 gap-2">
              <Code className="w-5 h-5" />
              <span>Documentation</span>
            </Button>
          </div>
          <div className="flex justify-center">
            <ArrowDown className="w-8 h-8 animate-bounce opacity-70" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <MessageSquare className="w-12 h-12 text-desktop-icon-messaging" />,
                title: "Messaging System",
                desc: "Real-time messaging platform with publish/subscribe patterns",
                path: "/apps/messaging"
              },
              {
                icon: <FileCode className="w-12 h-12 text-desktop-icon-xml" />,
                title: "XML Transformer",
                desc: "Transform XML content using XSLT stylesheets",
                path: "/apps/xml-transformer"
              },
              {
                icon: <FileText className="w-12 h-12 text-desktop-icon-java" />,
                title: "Java XML Parser",
                desc: "Parse and validate XML files with Java",
                path: "/apps/java-xml"
              },
              {
                icon: <Terminal className="w-12 h-12 text-desktop-icon-api" />,
                title: "API Tools",
                desc: "Execute API requests and custom bash scripts",
                path: "/apps/api"
              }
            ].map((feature, index) => (
              <Link to={feature.path} key={index} className="block">
                <div className="bg-desktop-window rounded-xl p-6 border border-white/10 hover:border-white/30 hover:scale-105 transition-all cursor-pointer h-full">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white text-center">{feature.title}</h3>
                  <p className="text-gray-300 text-center">{feature.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-desktop-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">About ProgDesk</h2>
          <div className="max-w-3xl mx-auto bg-desktop-window rounded-xl p-8 border border-white/10">
            <p className="text-gray-200 mb-4">
              ProgDesk is designed for developers who need a unified interface for common programming tasks.
              Each application provides specialized tools for different aspects of software development.
            </p>
            <p className="text-gray-200">
              Whether you're working with messaging systems, XML processing, or API integration,
              ProgDesk offers a comprehensive suite of tools in a familiar desktop-like interface.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 py-6 text-center text-gray-400">
        <p>© 2025 ProgDesk - Professional Developer Environment</p>
      </footer>
    </div>
  );
};

export default Index;
