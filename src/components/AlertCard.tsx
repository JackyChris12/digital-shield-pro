import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Ban, Eye } from "lucide-react";
import { format } from "date-fns";

interface Alert {
  id: string;
  platform: string;
  message: string;
  sender: string;
  toxicity_score: number;
  threat_level: "low" | "medium" | "high";
  status: string;
  created_at: string;
}

interface AlertCardProps {
  alert: Alert;
  onBlock?: (id: string) => void;
  onIgnore?: (id: string) => void;
}

const AlertCard = ({ alert, onBlock, onIgnore }: AlertCardProps) => {
  const threatColor = {
    high: "threat-high",
    medium: "threat-medium",
    low: "threat-low",
  }[alert.threat_level];

  return (
    <Card className="p-4 border-l-4 hover:bg-card/50 transition-colors" style={{ borderLeftColor: `hsl(var(--${threatColor}))` }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
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
            {alert.threat_level} threat
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          {format(new Date(alert.created_at), "MMM d, h:mm a")}
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <span className="text-sm text-muted-foreground">From: </span>
          <span className="text-sm font-medium">{alert.sender}</span>
        </div>
        <p className="text-sm text-foreground line-clamp-2">
          {alert.message}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Toxicity Score: {(alert.toxicity_score * 100).toFixed(1)}%</span>
        </div>
      </div>

      {alert.status === "new" && (
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onBlock?.(alert.id)}
            className="flex-1"
          >
            <Ban className="w-4 h-4 mr-1" />
            Block
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onIgnore?.(alert.id)}
            className="flex-1"
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
