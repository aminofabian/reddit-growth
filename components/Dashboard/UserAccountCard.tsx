'use client';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateRedditPassword } from '@/app/actions/datadisplay';
import { deleteRedditAccount } from '@/app/actions/reddit';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UserAccountCard = ({ 
  id,
  username, 
  karma, 
  hasPassword,
  onPasswordUpdate,
  onDelete 
}: { 
  id: string;
  username: string; 
  karma: number;
  hasPassword: boolean;
  onPasswordUpdate: () => void;
  onDelete: (id: string) => Promise<void>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [savedPassword, setSavedPassword] = useState<string>('');
  const [showSavedPassword, setShowSavedPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch the saved password when component mounts
  useEffect(() => {
    const fetchPassword = async () => {
      try {
        const response = await fetch(`/api/reddit/password/${id}`);
        const data = await response.json();
        if (data.success && data.password) {
          setSavedPassword(data.password);
        }
      } catch (err) {
        console.error('Failed to fetch password:', err);
      }
    };
    
    if (hasPassword) {
      fetchPassword();
    }
  }, [id, hasPassword]);
  
  const handleSubmit = async () => {
    if (!password.trim()) {
      setError('Password cannot be empty');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    setIsUpdating(true);
    
    try {
      const result = await updateRedditPassword(id, password);
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      if (result.success) {
        setIsEditing(false);
        setPassword('');
        setSavedPassword(password);
        await onPasswordUpdate();
      }
    } catch (err) {
      setError('Failed to update password. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsUpdating(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      const result = await deleteRedditAccount(id);
      
      if (!result.success) {
        setError(result.error || "Failed to delete account");
        return;
      }
      
      // If successful, trigger the parent component's onDelete callback
      await onDelete(id);
    } catch (error) {
      console.error('Failed to delete account:', error);
      setError('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Card className="mb-4 w-full border border-red-200 bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
    <CardContent className="p-4 sm:p-6">
    <div className="space-y-3">
    <div className="flex justify-between items-center mb-4">
    <div className="flex flex-col sm:flex-row sm:items-center">
    <span className="text-red-600 font-medium mr-2">Username:</span>
    <span className="font-semibold text-gray-900">{username}</span>
    </div>
    <AlertDialog>
    <AlertDialogTrigger asChild>
    <Button 
    variant="destructive" 
    size="sm"
    disabled={isDeleting}
    className="bg-red-600 hover:bg-red-700"
    >
    <Trash2 className="h-4 w-4 mr-2" />
    {isDeleting ? 'Deleting...' : 'Delete'}
    </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
    <AlertDialogHeader>
    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
    <AlertDialogDescription>
    This action cannot be undone. This will permanently delete the Reddit account &quot;{username}&quot; from your connected accounts.
    </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
    <AlertDialogAction 
    onClick={handleDelete}
    className="bg-red-600 hover:bg-red-700"
    >
    Delete Account
    </AlertDialogAction>
    </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
    </div>
    
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-red-100 pb-2">
    <span className="text-red-600 font-medium">Karma:</span>
    <span className="font-semibold text-gray-900 mt-1 sm:mt-0">{karma}</span>
    </div>
    
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-red-100 pb-2">
    <span className="text-red-600 font-medium">Password:</span>
    {isEditing ? (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-1 sm:mt-0 w-full sm:w-auto">
      <div className="relative w-full sm:w-auto">
      <Input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="pr-10"
      placeholder="Enter Reddit password"
      disabled={isSubmitting}
      />
      <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-2 top-1/2 transform -translate-y-1/2"
      disabled={isSubmitting}
      >
      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
      <Button 
      onClick={handleSubmit}
      disabled={isSubmitting}
      className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
      >
      {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
      <Button 
      onClick={() => {
        setIsEditing(false);
        setError(null);
        setPassword('');
      }}
      variant="outline"
      className="w-full sm:w-auto"
      disabled={isSubmitting}
      >
      Cancel
      </Button>
      </div>
      </div>
    ) : (
      <div className="flex items-center gap-2">
      {hasPassword && savedPassword && (
        <div className="relative flex items-center">
        <Input
        type={showSavedPassword ? "text" : "password"}
        value={savedPassword}
        className="pr-10"
        disabled
        />
        <button
        type="button"
        onClick={() => setShowSavedPassword(!showSavedPassword)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
        {showSavedPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        </div>
      )}
      <Button
      onClick={() => setIsEditing(true)}
      variant="outline"
      className="mt-1 sm:mt-0"
      disabled={isUpdating}
      >
      {hasPassword ? "Update Password" : "Add Password"}
      </Button>
      {isUpdating && (
        <span className="text-sm text-gray-500">Updating...</span>
      )}
      </div>
    )}
    {error && (
      <p className="text-red-500 text-sm mt-2 w-full">{error}</p>
    )}
    </div>
    </div>
    </CardContent>
    </Card>
  );
};

export default UserAccountCard;