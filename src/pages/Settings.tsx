
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Trash2, Shield, Info, HardDrive } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import { useToast } from '@/hooks/use-toast';
import { useDataManager } from '@/hooks/useDataManager';
import { StorageStats } from '@/services/DataManager';
import { copies } from '@/utils/copies';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { exportData, purgeAllData, getStorageStats, isLoading } = useDataManager();
  const [isDeleting, setIsDeleting] = useState(false);
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);

  useEffect(() => {
    loadStorageStats();
  }, []);

  const loadStorageStats = async () => {
    const stats = await getStorageStats();
    setStorageStats(stats);
  };

  const handleExportData = async () => {
    try {
      await exportData('full');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleDeleteAllData = async () => {
    if (isDeleting) {
      try {
        await purgeAllData();
        navigate('/');
      } catch (error) {
        console.error('Delete failed:', error);
      } finally {
        setIsDeleting(false);
      }
    } else {
      setIsDeleting(true);
      // Auto-cancel after 10 seconds
      setTimeout(() => setIsDeleting(false), 10000);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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
              <strong>100% Local Storage:</strong> {copies.privacy.assurance}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-foreground">
              <strong>No Account Required:</strong> {copies.privacy.noTracking}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-foreground">
              <strong>You're in Control:</strong> {copies.privacy.control}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Storage Information */}
      {storageStats && (
        <Card className="mb-6 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <HardDrive className="w-5 h-5 mr-2" />
              Storage Usage
            </CardTitle>
            <CardDescription>
              Your data footprint on this device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Journal Entries</p>
                <p className="font-medium">{storageStats.totalEntries} reflections</p>
              </div>
              <div>
                <p className="text-muted-foreground">Storage Used</p>
                <p className="font-medium">
                  {formatBytes((storageStats.localStorageSize + storageStats.indexedDBSize) * 1024)}
                </p>
              </div>
            </div>
            {storageStats.oldestEntry && storageStats.newestEntry && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Journey span: {new Date(storageStats.oldestEntry).toLocaleDateString()} to {new Date(storageStats.newestEntry).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Data Management */}
      <Card className="mb-6 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Data Management</CardTitle>
          <CardDescription>
            {copies.privacy.export}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleExportData}
            variant="outline" 
            className="w-full justify-start h-12"
            disabled={isLoading}
          >
            <Download className="w-4 h-4 mr-3" />
            {isLoading ? "Preparing Export..." : "Export My Data"}
          </Button>

          <Button 
            onClick={handleDeleteAllData}
            variant={isDeleting ? "destructive" : "outline"}
            className="w-full justify-start h-12"
            disabled={isLoading}
          >
            <Trash2 className="w-4 h-4 mr-3" />
            {isDeleting ? "Click Again to Confirm Delete" : "Delete All Data"}
          </Button>

          {isDeleting && (
            <div className="bg-destructive/10 rounded-lg p-4">
              <p className="text-sm text-destructive font-medium mb-2">
                {copies.contextual.deleteConfirmation}
              </p>
              <p className="text-xs text-muted-foreground">
                This action cannot be undone. All your reflections, audio recordings, and settings will be permanently removed from this device.
              </p>
            </div>
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
