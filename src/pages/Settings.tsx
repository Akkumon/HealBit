
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Upload, Trash2, Shield, Info } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExportData = () => {
    try {
      const data = {
        profile: JSON.parse(localStorage.getItem('healbit-user-profile') || '{}'),
        entries: JSON.parse(localStorage.getItem('healbit-journal-entries') || '[]'),
        settings: {
          lastMood: localStorage.getItem('healbit-last-mood'),
          userName: localStorage.getItem('healbit-user-name')
        },
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `healbit-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported",
        description: "Your HealBit data has been downloaded safely.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAllData = () => {
    if (isDeleting) {
      // Actually delete the data
      localStorage.removeItem('healbit-user-profile');
      localStorage.removeItem('healbit-journal-entries');
      localStorage.removeItem('healbit-last-mood');
      localStorage.removeItem('healbit-user-name');
      localStorage.removeItem('healbit-current-prompt');
      localStorage.removeItem('healbit-session-mood');

      toast({
        title: "Data Deleted",
        description: "All your HealBit data has been permanently removed.",
      });

      navigate('/');
      setIsDeleting(false);
    } else {
      setIsDeleting(true);
      // Auto-cancel after 10 seconds
      setTimeout(() => setIsDeleting(false), 10000);
    }
  };

  const getStorageSize = () => {
    let total = 0;
    for (let key in localStorage) {
      if (key.startsWith('healbit-')) {
        total += localStorage[key].length;
      }
    }
    return (total / 1024).toFixed(2); // KB
  };

  return (
    <PageContainer showNavigation={false}>
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <div className="w-10" />
      </div>

      {/* Privacy Information */}
      <Card className="mb-6 border-primary/20 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center text-primary">
            <Shield className="w-5 h-5 mr-2" />
            Your Privacy
          </CardTitle>
          <CardDescription>
            How HealBit protects your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-foreground">
              <strong>100% Local Storage:</strong> All your data stays on your device. Nothing is sent to external servers.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-foreground">
              <strong>No Account Required:</strong> Your healing journey is completely private and anonymous.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-foreground">
              <strong>You're in Control:</strong> Export or delete your data anytime with one click.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="mb-6 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Data Management</CardTitle>
          <CardDescription>
            Storage used: {getStorageSize()} KB
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleExportData}
            variant="outline" 
            className="w-full justify-start h-12"
          >
            <Download className="w-4 h-4 mr-3" />
            Export My Data
          </Button>

          <Button 
            onClick={handleDeleteAllData}
            variant={isDeleting ? "destructive" : "outline"}
            className="w-full justify-start h-12"
          >
            <Trash2 className="w-4 h-4 mr-3" />
            {isDeleting ? "Click Again to Confirm Delete" : "Delete All Data"}
          </Button>

          {isDeleting && (
            <p className="text-xs text-muted-foreground text-center">
              This will permanently delete all your journal entries, progress, and settings.
              This action cannot be undone.
            </p>
          )}
        </CardContent>
      </Card>

      {/* App Information */}
      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Info className="w-5 h-5 mr-2" />
            About HealBit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            HealBit is a voice-first micro-journaling app designed specifically for heartbreak recovery.
            Built with kindness, privacy, and your healing journey in mind.
          </p>
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Version 1.0.0 MVP • Built with love for your healing 💝
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Button 
          onClick={() => navigate('/')}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Return Home
        </Button>
      </div>
    </PageContainer>
  );
};

export default Settings;
