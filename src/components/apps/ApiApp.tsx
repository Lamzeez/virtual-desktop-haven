
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ApiApp: React.FC = () => {
  const { toast } = useToast();
  const [apiUrl, setApiUrl] = useState<string>("https://jsonplaceholder.typicode.com/users");
  const [bashScript, setBashScript] = useState<string>(`#!/bin/bash
# Simple API request script
curl -s "$API_URL" | jq`);
  const [method, setMethod] = useState<string>("GET");
  const [headers, setHeaders] = useState<string>('Content-Type: application/json');
  const [requestBody, setRequestBody] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [outputType, setOutputType] = useState<string>('json');

  const executeScript = async () => {
    setIsLoading(true);
    setOutput('');
    
    // Add bash simulation command line output
    let terminalOutput = `$ ${method.toLowerCase()} ${apiUrl}\n`;
    
    try {
      // Simulate bash execution by actually making the API request from the browser
      const headerObj: Record<string, string> = {};
      headers.split('\n').forEach(header => {
        const [key, value] = header.split(':').map(part => part.trim());
        if (key && value) {
          headerObj[key] = value;
        }
      });
      
      const options: RequestInit = {
        method,
        headers: headerObj
      };
      
      if (method !== 'GET' && method !== 'HEAD' && requestBody) {
        options.body = requestBody;
      }
      
      terminalOutput += `> Executing request...\n`;
      
      // Simulate delay to make it feel like a bash script is running
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const response = await fetch(apiUrl, options);
      const responseText = await response.text();
      
      let formattedOutput;
      try {
        // Try to parse as JSON for pretty printing
        const jsonData = JSON.parse(responseText);
        formattedOutput = JSON.stringify(jsonData, null, 2);
        setOutputType('json');
      } catch {
        // If not JSON, just use the raw text
        formattedOutput = responseText;
        setOutputType('text');
      }
      
      terminalOutput += `> Request complete. Status: ${response.status} ${response.statusText}\n\n`;
      terminalOutput += formattedOutput;
      
      setOutput(terminalOutput);
      
      toast({
        title: "API Request Complete",
        description: `Status: ${response.status} ${response.statusText}`
      });
    } catch (error) {
      console.error('API error:', error);
      
      terminalOutput += `> Error executing request\n`;
      terminalOutput += `> ${error instanceof Error ? error.message : "Unknown error occurred"}\n`;
      
      setOutput(terminalOutput);
      
      toast({
        title: "API Request Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const executeCustomScript = () => {
    setIsLoading(true);
    setOutput('');
    
    // Simulate bash script execution
    let terminalOutput = `$ bash script.sh\n`;
    
    // Replace variables in the script
    const scriptWithVars = bashScript.replace(/\$API_URL/g, apiUrl);
    
    terminalOutput += `> Executing bash script...\n`;
    terminalOutput += `> ${scriptWithVars.split('\n').join('\n> ')}\n\n`;
    
    // Simulate delay for script execution
    setTimeout(() => {
      // For demo purposes, just do a fetch
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const resultOutput = JSON.stringify(data, null, 2);
          terminalOutput += resultOutput;
          setOutput(terminalOutput);
          setIsLoading(false);
          
          toast({
            title: "Script Executed Successfully",
            description: "Bash script completed execution"
          });
        })
        .catch(error => {
          terminalOutput += `> Error executing script\n`;
          terminalOutput += `> ${error.message}\n`;
          setOutput(terminalOutput);
          setIsLoading(false);
          
          toast({
            title: "Script Execution Failed",
            description: error.message,
            variant: "destructive"
          });
        });
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full text-white">
      <h2 className="text-xl font-semibold mb-4">API Interaction Tool</h2>
      
      <Tabs defaultValue="simple" className="flex flex-col h-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="simple">Simple API Request</TabsTrigger>
          <TabsTrigger value="bash">Bash Script</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simple" className="flex-1 flex flex-col">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Method</label>
              <select 
                className="w-full p-2 rounded-md bg-black/20 border border-white/20"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">API URL</label>
              <Input
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.example.com/endpoint"
                className="bg-black/20 border-white/20"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="text-sm font-medium mb-1 block">Headers (one per line)</label>
            <Textarea
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              placeholder="Content-Type: application/json
Authorization: Bearer YOUR_TOKEN"
              className="h-20 bg-black/20 border-white/20"
            />
          </div>
          
          {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Request Body</label>
              <Textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                placeholder="{
  \"name\": \"John Doe\",
  \"email\": \"john@example.com\"
}"
                className="h-20 bg-black/20 border-white/20"
              />
            </div>
          )}
          
          <div className="mb-4">
            <Button 
              onClick={executeScript} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Executing..." : "Execute Request"}
            </Button>
          </div>
          
          <div className="flex-1 bg-black rounded-md p-2 font-mono text-sm overflow-auto">
            {isLoading ? (
              <div className="animate-pulse text-green-500">
                $ {method.toLowerCase()} {apiUrl}<br/>
                > Executing request...
              </div>
            ) : output ? (
              <pre className="text-green-500 whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="text-gray-500">
                # Output will appear here after executing the request
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="bash" className="flex-1 flex flex-col">
          <div className="mb-4">
            <label className="text-sm font-medium mb-1 block">API URL</label>
            <Input
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://api.example.com/endpoint"
              className="bg-black/20 border-white/20"
            />
            <p className="text-xs text-gray-400 mt-1">
              This will be available as $API_URL in your script
            </p>
          </div>
          
          <div className="mb-4">
            <label className="text-sm font-medium mb-1 block">Bash Script</label>
            <Textarea
              value={bashScript}
              onChange={(e) => setBashScript(e.target.value)}
              className="h-40 font-mono text-sm bg-black/20 border-white/20"
            />
          </div>
          
          <div className="mb-4">
            <Button 
              onClick={executeCustomScript} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Executing..." : "Execute Bash Script"}
            </Button>
          </div>
          
          <div className="flex-1 bg-black rounded-md p-2 font-mono text-sm overflow-auto">
            {isLoading ? (
              <div className="animate-pulse text-green-500">
                $ bash script.sh<br/>
                > Executing bash script...<br/>
                {bashScript.split('\n').map((line, i) => (
                  <span key={i}>> {line}<br/></span>
                ))}
              </div>
            ) : output ? (
              <pre className="text-green-500 whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="text-gray-500">
                # Output will appear here after executing the script
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiApp;
