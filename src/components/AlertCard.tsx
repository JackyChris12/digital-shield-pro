import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Ban, Eye } from "lucide-react";
import { format } from "date-fns";

interface Alert {
  id: string;
  platform: string;
  message?: string;
  comment?: string;
  sender?: string;
  author?: string;
  toxicity_score?: number;
  severity?: string;
  threat_level?: "low" | "medium" | "high";
  status: string;
  created_at?: string;
  timestamp?: Date;
}

interface AlertCardProps {
  alert: Alert;
  onBlock?: (id: string) => void;
  onIgnore?: (id: string) => void;
}

const AlertCard = ({ alert, onBlock, onIgnore }: AlertCardProps) => {
  // Handle both Supabase alerts (threat_level) and mock alerts (severity)
  const threatLevel = alert.threat_level || alert.severity || 'low';
  const threatColor = {
    high: "threat-high",
    critical: "threat-high",
    medium: "threat-medium",
    low: "threat-low",
  }[threatLevel as string] || "threat-low";

  // Get the date from either created_at or timestamp
  const getAlertDate = () => {
    if (alert.timestamp) {
      return alert.timestamp instanceof Date ? alert.timestamp : new Date(alert.timestamp);
    }
    if (alert.created_at) {
      return new Date(alert.created_at);
    }
    return new Date();
  };

  const formatDate = () => {
    try {
      const date = getAlertDate();
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return format(date, "MMM d, h:mm a");
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get message from either message or comment field
  const displayMessage = alert.message || alert.comment || 'No message';
  // Get sender from either sender or author field
  const displaySender = alert.sender || alert.author || 'Unknown';

  return (
    <Card className="p-4 md:p-3 border-l-4 hover:bg-card/50 transition-colors" style={{ borderLeftColor: `hsl(var(--${threatColor}))` }}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <AlertCircle className="w-4 h-4" style={{ color: `hsl(var(--${threatColor}))` }} />
          <Badge variant="outline" className="capitalize">
            {alert.platform}
          </Badge>
          <Badge
            className="capitalize"
            style={{
              backgroundColor: `hsl(var(--${threatColor}) / 0.2)`,
              color: `hsl(var(--${threatColor}))`,
              border: `1px solid hsl(var(--${threatColor}) / 0.3)`
            }}
          >
            {threatLevel} threat
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDate()}
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <span className="text-sm text-muted-foreground">From: </span>
          <span className="text-sm font-medium">{displaySender}</span>
        </div>
        <p className="text-sm text-foreground line-clamp-2">
          {displayMessage}
        </p>
        {alert.toxicity_score !== undefined && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Toxicity Score: {(alert.toxicity_score * 100).toFixed(1)}%</span>
          </div>
        )}
      </div>

      {alert.status === "new" && (
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onBlock?.(alert.id)}
            className="flex-1 min-h-[44px]"
          >
            <Ban className="w-4 h-4 mr-1" />
            Block
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onIgnore?.(alert.id)}
            className="flex-1 min-h-[44px]"
          >
            <Eye className="w-4 h-4 mr-1" />
            Ignore
          </Button>
        </div>
      )}
    </Card>
  );
};

export default AlertCard;
