import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Mail, Bell, Users } from "lucide-react";

export default function Settings() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [notificationDay, setNotificationDay] = useState("Monday");

  // todo: remove mock functionality
  const employees = ["tyler", "nalleli", "claudia", "ana"];

  const handleSave = () => {
    console.log("Settings saved");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure email notifications and employee information
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <CardTitle>Email Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure automated email reminders for task assignments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-toggle">Enable Email Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Send weekly reminders to assigned employees
                </p>
              </div>
              <Switch
                id="email-toggle"
                checked={emailEnabled}
                onCheckedChange={setEmailEnabled}
                data-testid="switch-email-notifications"
              />
            </div>

            {emailEnabled && (
              <div className="space-y-3 pt-4 border-t">
                <Label htmlFor="notification-day">Notification Day</Label>
                <Input
                  id="notification-day"
                  value={notificationDay}
                  onChange={(e) => setNotificationDay(e.target.value)}
                  placeholder="e.g., Monday"
                  data-testid="input-notification-day"
                />
                <p className="text-xs text-muted-foreground">
                  Day of the week to send assignment reminders
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employee Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Employee Information</CardTitle>
            </div>
            <CardDescription>
              Manage employee email addresses for notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {employees.map((employee) => (
              <div key={employee} className="space-y-2">
                <Label htmlFor={`email-${employee}`} className="capitalize">
                  {employee}
                </Label>
                <Input
                  id={`email-${employee}`}
                  type="email"
                  placeholder={`${employee}@company.com`}
                  data-testid={`input-email-${employee}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} data-testid="button-save-settings">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
