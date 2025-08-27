'use client';

import { useState } from "react";
import { addRedditAccount } from "@/app/actions/reddit";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusIcon, ExternalLinkIcon, SearchIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RedditUser {
  creationDate: string;
  icon: string;
  id: string;
  karma: number;
  name: string;
  nsfw: boolean;
  url: string;
}

interface AddAccountModalProps {
  onAccountAdded: () => void;
}



const AddAccountModal: React.FC<AddAccountModalProps> = ({ onAccountAdded }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<RedditUser | null>(null);
  
  const searchRedditUser = async () => {
    setIsLoading(true);
    setError("");
    setUserData(null);
    
    try {
      const response = await fetch(`https://reddit-scraper2.p.rapidapi.com/search_users?query=${username}&nsfw=0`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '52655f1cfbmshc28794a26461c71p1a3967jsnc854ec10622d',
          'x-rapidapi-host': 'reddit-scraper2.p.rapidapi.com'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      if (responseData.data && responseData.data.length > 0) {
        setUserData(responseData.data[0]);
      } else {
        setError("No users found");
      }
    } catch (err) {
      console.error('Reddit search error:', err);
      setError(
        err instanceof Error
        ? err.message
        : 'Failed to search Reddit user. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConnectAccount = async () => {
    if (!userData) return;
    
    try {
      setIsLoading(true);
      
      // Simulate getting tokens from OAuth flow
      // In a real implementation, you would get these from the Reddit OAuth process
      const mockTokens = {
        accessToken: "mock_access_token",
        refreshToken: "mock_refresh_token"
      };
      
      const result = await addRedditAccount({
        redditUsername: userData.name,
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        karmaCount: userData.karma
      });
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast.success("Reddit account connected successfully!");
      setIsOpen(false);
      router.refresh(); // Refresh the page to show updated data
    } catch (err) {
      console.error('Failed to connect account:', err);
      toast.error(err instanceof Error ? err.message : "Failed to connect account");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild>
    <Button
    variant="outline"
    className="rounded-full bg-white p-3 hover:bg-red-50 border-2 border-red-600 shadow-lg transition-all duration-300 hover:scale-105"
    onClick={() => setIsOpen(true)}
    aria-label="Add Reddit Account"
    >
    <PlusIcon className="h-5 w-5 text-red-600" />
    </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-md bg-white border-2 border-red-100 shadow-2xl">
    <DialogHeader>
    <DialogTitle className="text-2xl font-bold text-gray-900 text-center pb-2 border-b-2 border-red-100">
    Add Reddit Account
    </DialogTitle>
    </DialogHeader>
    <div className="space-y-6 mt-6">
    {error && (
      <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
      <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}
    
    <div className="space-y-4">
    <div className="text-sm text-gray-600 font-medium">
    Enter a Reddit username to search for their profile
    </div>
    
    <div className="flex gap-2">
    <div className="relative flex-1">
    <Input
    type="text"
    placeholder="Enter Your Reddit Username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="pl-4 pr-10 py-2 border-2 border-gray-200 focus:border-red-400 focus:ring-red-400 rounded-lg"
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        searchRedditUser();
      }
    }}
    />
    <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    </div>
    <Button
    onClick={searchRedditUser}
    disabled={isLoading || !username}
    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
    {isLoading ? (
      <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
    ) : (
      "Search"
    )}
    </Button>
    </div>
    
    {userData && (
      <div className="mt-6 rounded-xl border-2 border-red-100 overflow-hidden">
      <div className="bg-red-50 p-4">
      <div className="flex items-center gap-4">
      <img 
      src={userData.icon} 
      alt="Profile" 
      className="w-16 h-16 rounded-full border-2 border-white shadow-md"
      onError={(e) => {
        e.currentTarget.src = "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png";
      }}
      />
      <div>
      <h3 className="text-lg font-bold text-gray-900">u/{userData.name}</h3>
      <p className="text-sm text-gray-500 font-mono">ID: {userData.id}</p>
      </div>
      </div>
      </div>
      
      <div className="p-4 bg-white space-y-3">
      <div className="grid grid-cols-2 gap-2 text-sm">
      <div className="p-2 bg-gray-50 rounded-lg">
      <div className="text-gray-600 font-medium">Karma</div>
      <div className="text-gray-900 font-bold">{userData.karma.toLocaleString()}</div>
      </div>
      <div className="p-2 bg-gray-50 rounded-lg">
      <div className="text-gray-600 font-medium">Created</div>
      <div className="text-gray-900 font-bold">
      {new Date(userData.creationDate).toLocaleDateString()}
      </div>
      </div>
      </div>
      
      <div className="pt-3">
      <Button
      onClick={handleConnectAccount}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300 shadow-md hover:shadow-lg"
      >
      {isLoading ? (
        <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
        Connect Account
        <ExternalLinkIcon className="h-4 w-4" />
        </>
      )}
      </Button>
      </div>
      </div>
      </div>
    )}
    </div>
    </div>
    </DialogContent>
    </Dialog>
  );
}


export default AddAccountModal;