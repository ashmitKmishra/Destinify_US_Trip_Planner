
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { setOpenAIKey, setDeepSeekKey, setGrokKey } from "@/lib/api";
import { AlertCircle, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ApiKeyModal({ 
  open, 
  onClose, 
  defaultTab = "grok" 
}: { 
  open: boolean; 
  onClose: () => void;
  defaultTab?: "grok" | "openai" | "deepseek";
}) {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"grok" | "openai" | "deepseek">(defaultTab);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!apiKey.trim()) {
      setError("API key cannot be empty");
      return;
    }
    
    if (activeTab === "openai" && !apiKey.startsWith("sk-")) {
      setError("Invalid API key format. OpenAI keys typically start with 'sk-'");
      return;
    }
    
    if (activeTab === "grok" && !apiKey.trim()) {
      setError("API key cannot be empty");
      return;
    }
    
    if (activeTab === "deepseek" && !apiKey.trim()) {
      // DeepSeek keys don't have a specific format we can validate yet
      setError("API key cannot be empty");
      return;
    }
    
    if (activeTab === "grok") {
      setGrokKey(apiKey);
    } else if (activeTab === "openai") {
      setOpenAIKey(apiKey);
    } else {
      setDeepSeekKey(apiKey);
    }
    
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter API Key</DialogTitle>
          <DialogDescription>
            Please enter your API key to enable trip generation features.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={(value) => setActiveTab(value as "grok" | "openai" | "deepseek")}>
            <TabsList className="w-full">
              <TabsTrigger value="grok" className="flex-1">Grok</TabsTrigger>
              <TabsTrigger value="openai" className="flex-1">OpenAI</TabsTrigger>
              <TabsTrigger value="deepseek" className="flex-1">DeepSeek</TabsTrigger>
            </TabsList>
            
            <TabsContent value="grok" className="space-y-4 mt-4">
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  You can get your Grok API key from{" "}
                  <a 
                    href="https://x.ai/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="underline font-medium"
                  >
                    https://x.ai/
                  </a>
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="openai" className="space-y-4 mt-4">
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  You can get your OpenAI API key from{" "}
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noreferrer"
                    className="underline font-medium"
                  >
                    https://platform.openai.com/api-keys
                  </a>
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="deepseek" className="space-y-4 mt-4">
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  You can get your DeepSeek API key from{" "}
                  <a 
                    href="https://platform.deepseek.com/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="underline font-medium"
                  >
                    https://platform.deepseek.com/
                  </a>
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder={
                activeTab === "openai" ? "sk-..." : 
                activeTab === "grok" ? "Your Grok API key" : 
                "Your DeepSeek API key"
              }
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
          </form>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} className="w-full sm:w-auto">
            Save API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
