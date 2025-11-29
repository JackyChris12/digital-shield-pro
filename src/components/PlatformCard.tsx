import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Twitter, Instagram, MessageCircle, CheckCircle2, XCircle, Music2 } from "lucide-react";

interface Platform {
  id: string;
  platform_name: string;
  is_active: boolean;
  last_sync_at?: string;
}

interface PlatformCardProps {
  platform?: Platform;
  platformName: string;
  onConnect?: () => void;
}

const platformIcons = {
  twitter: Twitter,
  instagram: Instagram,
  tiktok: Music2,
};

const PlatformCard = ({ platform, platformName, onConnect }: PlatformCardProps) => {
  const Icon = platformIcons[platformName as keyof typeof platformIcons];
  const isConnected = platform?.is_active;

  return (
    <Card className="p-4 hover:bg-card/50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isConnected ? 'bg-success/20' : 'bg-muted'}`}>
            <Icon className={`w-5 h-5 ${isConnected ? 'text-success' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <h3 className="font-semibold capitalize">{platformName}</h3>
            {isConnected && platform?.last_sync_at && (
              <p className="text-xs text-muted-foreground">
                Last synced: {new Date(platform.last_sync_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        {isConnected ? (
          <Badge className="bg-success/20 text-success border-success/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Active
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            <XCircle className="w-3 h-3 mr-1" />
            Inactive
          </Badge>
        )}
      </div>

      {!isConnected && (
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={onConnect}
        >
          Connect {platformName}
        </Button>
      )}
    </Card>
  );
};

export default PlatformCard;
