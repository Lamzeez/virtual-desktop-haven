
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const JavaXmlApp: React.FC = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setParsedData(null);
    }
  };

  const parseXml = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select an XML file to parse",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Read the file
      const fileContent = await readFileAsText(file);
      
      // Parse the XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(fileContent, "text/xml");
      
      // Check for parse errors
      const parseError = xmlDoc.getElementsByTagName("parsererror").length > 0;
      
      if (parseError) {
        toast({
          title: "Parse Error",
          description: "There was an error parsing the XML file",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }
      
      // Convert XML to a JavaScript object
      const result = xmlToObj(xmlDoc);
      
      // Simulate Java processing delay
      setTimeout(() => {
        setParsedData(result);
        setIsProcessing(false);
        
        toast({
          title: "XML Parsed Successfully",
          description: `Parsed ${file.name} (${formatBytes(file.size)})`
        });
      }, 1500);
    } catch (error) {
      console.error('Parsing error:', error);
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  // Helper function to read file content
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  // Helper function to convert XML to JavaScript object
  const xmlToObj = (xml: Document): any => {
    // Convert XML document to JSON object (simplified)
    function convertNodeToObj(node: Element): any {
      const obj: any = {};
      
      // Add attributes
      if (node.attributes && node.attributes.length > 0) {
        obj._attributes = {};
        for (let i = 0; i < node.attributes.length; i++) {
          const attr = node.attributes[i];
          obj._attributes[attr.name] = attr.value;
        }
      }
      
      // Add child nodes
      if (node.hasChildNodes()) {
        for (let i = 0; i < node.childNodes.length; i++) {
          const childNode = node.childNodes[i];
          
          // Text node
          if (childNode.nodeType === Node.TEXT_NODE) {
            const text = childNode.nodeValue?.trim();
            if (text && text.length > 0) {
              if (Object.keys(obj).length === 0 || 
                 (Object.keys(obj).length === 1 && obj._attributes)) {
                obj._text = text;
              }
            }
          }
          // Element node
          else if (childNode.nodeType === Node.ELEMENT_NODE) {
            const childName = childNode.nodeName;
            
            const childObj = convertNodeToObj(childNode as Element);
            
            if (obj[childName]) {
              // Convert to array if not already
              if (!Array.isArray(obj[childName])) {
                obj[childName] = [obj[childName]];
              }
              obj[childName].push(childObj);
            } else {
              obj[childName] = childObj;
            }
          }
        }
      }
      
      return obj;
    }
    
    // Process the root element
    return convertNodeToObj(xml.documentElement);
  };

  // Helper function to format bytes
  const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Helper function to render JSON view
  const renderJsonView = (data: any, level = 0): JSX.Element => {
    const indent = '\u00A0'.repeat(level * 4); // Non-breaking spaces for indentation
    
    if (typeof data !== 'object' || data === null) {
      return <div>{indent}{JSON.stringify(data)}</div>;
    }
    
    return (
      <>
        {Object.entries(data).map(([key, value], index) => {
          const isObject = typeof value === 'object' && value !== null;
          const isArray = Array.isArray(value);
          
          return (
            <div key={index}>
              {indent}<span className="text-blue-400">{key}</span>: {
                isObject ? (
                  <>
                    {isArray ? '[' : '{'}
                    {renderJsonView(value, level + 1)}
                    {indent}{isArray ? ']' : '}'}
                  </>
                ) : (
                  <span className="text-green-400">{JSON.stringify(value)}</span>
                )
              }
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="flex flex-col h-full text-white">
      <h2 className="text-xl font-semibold mb-4">Java XML Parser</h2>
      
      <div className="bg-black/20 p-4 rounded-md mb-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="file"
              id="xmlFileInput"
              onChange={handleFileChange}
              accept=".xml"
              className="hidden"
            />
            <label 
              htmlFor="xmlFileInput" 
              className="block w-full px-4 py-2 bg-black/20 border border-white/20 rounded-md cursor-pointer hover:bg-black/30 transition-colors"
            >
              {file ? file.name : "Choose XML File"}
            </label>
          </div>
          <Button 
            onClick={parseXml} 
            disabled={!file || isProcessing}
            className="whitespace-nowrap"
          >
            {isProcessing ? "Processing..." : "Parse XML"}
          </Button>
        </div>
      </div>
      
      <div className="flex-1">
        <Tabs defaultValue="parsed" className="flex flex-col h-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="parsed">Parsed Data</TabsTrigger>
            <TabsTrigger value="tree">Tree View</TabsTrigger>
            <TabsTrigger value="logs">Java Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="parsed" className="flex-1 bg-black/10 p-4 rounded-md overflow-auto font-mono text-sm">
            {isProcessing ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-white rounded-full mx-auto mb-4"></div>
                  <p>Processing XML with Java...</p>
                </div>
              </div>
            ) : parsedData ? (
              <pre>{JSON.stringify(parsedData, null, 2)}</pre>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Upload and parse an XML file to see results
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tree" className="flex-1 bg-black/10 p-4 rounded-md overflow-auto font-mono text-sm">
            {isProcessing ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-white rounded-full mx-auto mb-4"></div>
                  <p>Processing XML with Java...</p>
                </div>
              </div>
            ) : parsedData ? (
              <div className="text-left">
                {renderJsonView(parsedData)}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Upload and parse an XML file to see tree view
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="logs" className="flex-1 bg-black p-4 rounded-md overflow-auto font-mono text-xs text-green-400">
            {isProcessing ? (
              <>
                <div>[INFO] Starting XML parsing process</div>
                <div>[INFO] Loading XML document into memory</div>
                <div>[INFO] Initializing SAX parser</div>
                <div>[INFO] Creating document factory</div>
                <div className="animate-pulse">[INFO] Processing document...</div>
              </>
            ) : parsedData ? (
              <>
                <div>[INFO] Starting XML parsing process</div>
                <div>[INFO] Loading XML document into memory</div>
                <div>[INFO] Initializing SAX parser</div>
                <div>[INFO] Creating document factory</div>
                <div>[INFO] Processing document...</div>
                <div>[INFO] Creating object model</div>
                <div>[INFO] Traversing document tree</div>
                <div>[INFO] Document successfully parsed</div>
                <div>[INFO] Memory allocated: 14.3MB</div>
                <div>[INFO] Process completed in 1.52 seconds</div>
                <div>[INFO] XML validation successful</div>
              </>
            ) : (
              <div>[INFO] Java XML parser initialized and ready</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JavaXmlApp;
