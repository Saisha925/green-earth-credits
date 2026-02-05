import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { ReactNode } from "react";

interface AuthRequiredProps {
  children: ReactNode;
  action?: string;
}

export const AuthRequired = ({ children, action = "continue" }: AuthRequiredProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="glass-card rounded-xl p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center">
          <Lock className="w-6 h-6 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium mb-1">Authentication Required</p>
          <p className="text-sm text-muted-foreground">
            Please log in to {action}
          </p>
        </div>
        <div className="flex gap-2 justify-center">
          <Link to="/login">
            <Button variant="outline">Log in</Button>
          </Link>
          <Link to="/register">
            <Button className="gradient-primary text-primary-foreground">
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

interface AuthRequiredButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  action?: string;
}

export const AuthRequiredButton = ({
  onClick,
  disabled,
  className,
  children,
  action = "perform this action"
}: AuthRequiredButtonProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Button disabled className={className}>
        <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  if (!user) {
    return (
      <div className="space-y-2">
        <Button disabled className={className}>
          <Lock className="w-4 h-4 mr-2" />
          {children}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Please <Link to="/login" className="text-primary hover:underline">log in</Link> to {action}
        </p>
      </div>
    );
  }

  return (
    <Button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </Button>
  );
};
