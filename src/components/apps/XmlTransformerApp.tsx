
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const XmlTransformerApp: React.FC = () => {
  const { toast } = useToast();
  const [xmlInput, setXmlInput] = useState<string>(`<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction">
    <title>The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <price>15.99</price>
  </book>
  <book category="non-fiction">
    <title>A Brief History of Time</title>
    <author>Stephen Hawking</author>
    <year>1988</year>
    <price>18.95</price>
  </book>
</bookstore>`);

  const [xsltInput, setXsltInput] = useState<string>(`<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <body>
        <h2>My Book Collection</h2>
        <table border="1">
          <tr bgcolor="#9acd32">
            <th>Title</th>
            <th>Author</th>
            <th>Year</th>
            <th>Price</th>
          </tr>
          <xsl:for-each select="bookstore/book">
            <tr>
              <td><xsl:value-of select="title"/></td>
              <td><xsl:value-of select="author"/></td>
              <td><xsl:value-of select="year"/></td>
              <td><xsl:value-of select="price"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`);

  const [output, setOutput] = useState<string>('');
  const [previewHtml, setPreviewHtml] = useState<string>('');

  const transformXml = () => {
    try {
      // Parse the XML input
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlInput, "text/xml");
      
      // Parse the XSLT input
      const xsltDoc = parser.parseFromString(xsltInput, "text/xml");
      
      // Check for parse errors
      const parseError = xmlDoc.getElementsByTagName("parsererror").length > 0 ||
                         xsltDoc.getElementsByTagName("parsererror").length > 0;
      
      if (parseError) {
        toast({
          title: "Parse Error",
          description: "There was an error parsing the XML or XSLT",
          variant: "destructive"
        });
        return;
      }
      
      // Create XSLT processor
      // Note: This will work in most modern browsers but not all
      // @ts-ignore - XSLTProcessor may not be recognized by TypeScript
      const xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsltDoc);
      
      // Transform the XML
      const resultDocument = xsltProcessor.transformToDocument(xmlDoc);
      
      // Convert result to string
      const serializer = new XMLSerializer();
      const resultString = serializer.serializeToString(resultDocument);
      
      // Set output
      setOutput(resultString);
      
      // Set preview HTML (if result is HTML)
      setPreviewHtml(resultString);
      
      toast({
        title: "Transformation Complete",
        description: "XML has been successfully transformed"
      });
    } catch (error) {
      console.error('Transformation error:', error);
      toast({
        title: "Transformation Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col h-full text-white">
      <h2 className="text-xl font-semibold mb-4">XML to XSLT Transformer</h2>
      
      <div className="grid grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium mb-2">XML Input</h3>
          <Textarea 
            className="flex-1 font-mono text-sm bg-black/20 border-white/20"
            value={xmlInput}
            onChange={(e) => setXmlInput(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-sm font-medium mb-2">XSLT Stylesheet</h3>
          <Textarea 
            className="flex-1 font-mono text-sm bg-black/20 border-white/20"
            value={xsltInput}
            onChange={(e) => setXsltInput(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-center my-4">
        <Button onClick={transformXml}>Transform XML</Button>
      </div>
      
      <div className="flex-1">
        <Tabs defaultValue="output" className="flex flex-col h-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="output">Output</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="output" className="flex-1">
            <Textarea 
              className="h-full font-mono text-sm bg-black/20 border-white/20"
              value={output}
              readOnly
            />
          </TabsContent>
          
          <TabsContent value="preview" className="flex-1 bg-white text-black p-4 rounded-md overflow-auto">
            {previewHtml ? (
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Transform XML to see preview
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default XmlTransformerApp;
