
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
import { setOpenAIKey } from "@/lib/api";
import { AlertCircle, Info } from "lucide-react";

export function ApiKeyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!apiKey.trim()) {
      setError("API key cannot be empty");
      return;
    }
    
    if (!apiKey.startsWith("sk-")) {
      setError("Invalid API key format. OpenAI keys typically start with 'sk-'");
      return;
    }
    
    setOpenAIKey(apiKey);
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter OpenAI API Key</DialogTitle>
          <DialogDescription>
            Please enter your OpenAI API key to enable trip generation features.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              You can get your API key from{" "}
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
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="sk-..."
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
