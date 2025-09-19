import { useState, memo } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { User, LogOut, ChevronLeft, ChevronRight, Users, BarChart3, Bell, UserCircle, ChevronDown, Settings, Shield, AlertTriangle, ExternalLink } from "lucide-react";
import { ImageWithFallback } from '../figma/ImageWithFallback';
// import covasantLogo from 'figma:asset/8252b3995a92f9c0df49a2d6d0a08c4d91d73449.png';
import newCovasantLogo from 'figma:asset/e83c2af77e18b0769514de1a84bc586feab1dd1b.png';
import type { PersonaType, BreadcrumbItem, NavigationHeaderProps, Notification } from './types';



const NavigationHeader = memo(function NavigationHeader({ 
  breadcrumbs = [], 
  currentPersona = "analyst", 
  onPersonaChange,
  notifications = [],
  unreadNotificationCount = 0,
  onNotificationClick,
  onMarkNotificationAsRead,
  showSearch = false,
  searchPlaceholder = "Search...",
  searchQuery = "",
  onSearchChange
}: NavigationHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAlertPanel, setShowAlertPanel] = useState(false);

  // Mock alert data for manager - matching the design image
  const activeAlerts = [
    {
      id: "alert-001",
      category: "CER Issues",
      title: "CER-10234 exceeded 30-day deadline",
      severity: "HIGH",
      timestamp: "2 hours ago",
      cerId: "CER-10234",
      recommendedActions: [
        "Escalate to senior analyst for immediate review",
        "Contact vendor for expedited completion",
        "Review resource allocation for future CERs"
      ]
    },
    {
      id: "alert-002", 
      category: "AI Analysis Accuracy",
      title: "TS-324472 confidence below 60% threshold",
      severity: "MEDIUM",
      timestamp: "4 hours ago",
      testScriptId: "TS-324472",
      recommendedActions: [
        "Manually review AI analysis for accuracy",
        "Request additional vendor documentation",
        "Consider human analyst override"
      ]
    },
    {
      id: "alert-003",
      category: "Vendor Effectiveness", 
      title: "Amazon Web Services - 3 overdue submissions affecting timeline",
      severity: "HIGH",
      timestamp: "6 hours ago",
      vendorName: "Amazon Web Services",
      recommendedActions: [
        "Schedule urgent vendor communication",
        "Review submission deadlines and capacity",
        "Implement additional monitoring measures"
      ]
    },
    {
      id: "alert-004",
      category: "Test Script Problems",
      title: "TS-324473 failed validation checks - requires review", 
      severity: "MEDIUM",
      timestamp: "5 hours ago",
      testScriptId: "TS-324473",
      recommendedActions: [
        "Conduct detailed validation review",
        "Update test script criteria if needed",
        "Provide vendor guidance on requirements"
      ]
    }
  ];

  const handleSignOut = () => {
    // Here you would typically handle the sign-out logic
    // For now, we'll just show an alert and could redirect to login
    alert("Sign out functionality - would redirect to login page");
    // In a real app, you might do: window.location.href = '/login'
  };

  const getPersonaDisplayName = () => {
    switch (currentPersona) {
      case "analyst": return "Jacob Corman (Risk Analyst)";
      case "vendor": return "Amazon Web Services (Vendor)";
      case "manager": return "Michael Torres (Risk Manager)";
      default: return "Jacob Corman (Risk Analyst)";
    }
  };

  const getPersonaIcon = () => {
    switch (currentPersona) {
      case "analyst": return <BarChart3 className="h-4 w-4" />;
      case "vendor": return <Users className="h-4 w-4" />;
      case "manager": return <Shield className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };
  
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="px-6 py-3">
        {/* Main Row */}
        <div className="flex items-center justify-between">
          {/* Left - Logo, Brand and Breadcrumbs */}
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <ImageWithFallback src={newCovasantLogo} alt="Covasant - AI-Driven. Human-Inspired." className="h-9 w-auto object-contain flex-shrink-0" />
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <div className="text-xl font-semibold text-gray-900 leading-tight">Vendor Continuous Monitoring</div>
                  {breadcrumbs.length > 0 && (
                    <div className="flex items-center space-x-1 text-base text-gray-600">
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                      {breadcrumbs.map((item, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          {item.onClick ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={item.onClick}
                              className="px-2 py-1 h-auto text-base text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            >
                              {item.label}
                            </Button>
                          ) : (
                            <span className="font-medium text-gray-900 px-2 text-base">{item.label}</span>
                          )}
                          {index < breadcrumbs.length - 1 && (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Risk Management Platform</div>
              </div>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications - Visible for all personas */}
            <Popover open={showNotifications} onOpenChange={setShowNotifications}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-3 h-12 w-12 hover:bg-gray-100 relative"
                >
                  <Bell className="h-7 w-7 text-gray-600" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <Badge variant="secondary" className="text-xs">
                      {unreadNotificationCount} new
                    </Badge>
                  </div>
                  {notifications.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {notifications.length} total notifications
                    </p>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No notifications yet</p>
                      <p className="text-xs text-gray-400 mt-1">You'll see updates here when they arrive</p>
                    </div>
                  ) : (
                    <div className="space-y-0">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 transition-colors ${
                            notification.isRead 
                              ? 'border-l-transparent bg-white' 
                              : currentPersona === "analyst" 
                                ? 'border-l-blue-500 bg-blue-50/30'
                                : currentPersona === "vendor"
                                  ? 'border-l-amber-500 bg-amber-50/30'
                                  : 'border-l-green-500 bg-green-50/30'
                          }`}
                          onClick={() => {
                            setShowNotifications(false);
                            if (onNotificationClick) {
                              onNotificationClick(notification);
                            } else if (onMarkNotificationAsRead) {
                              onMarkNotificationAsRead(notification.id);
                            }
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${notification.isRead ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs font-mono">
                                  {notification.testScriptId}
                                </Badge>
                                <Separator orientation="vertical" className="h-3" />
                                <span className="text-xs text-gray-500">
                                  {new Date(notification.timestamp).toLocaleDateString([], { 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })} at{' '}
                                  {new Date(notification.timestamp).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                              </div>
                            </div>
                            {!notification.isRead && (
                              <div className={`h-2 w-2 rounded-full mt-1 ml-2 flex-shrink-0 ${
                                currentPersona === "analyst" ? 'bg-blue-600' : 
                                currentPersona === "vendor" ? 'bg-amber-600' : 'bg-green-600'
                              }`}></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-3 border-t bg-gray-50">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-sm hover:bg-gray-100"
                      onClick={() => {
                        notifications.forEach(notification => {
                          if (!notification.isRead && onMarkNotificationAsRead) {
                            onMarkNotificationAsRead(notification.id);
                          }
                        });
                      }}
                    >
                      Mark all as read
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {/* Alert Icon - Only visible for manager persona */}
            {currentPersona === "manager" && (
              <Sheet open={showAlertPanel} onOpenChange={setShowAlertPanel}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-3 h-12 w-12 hover:bg-gray-100 relative"
                    title="Alerts & Warnings"
                  >
                    <AlertTriangle className="h-7 w-7 text-amber-600" />
                    {activeAlerts.filter(alert => alert.severity === 'HIGH').length > 0 && (
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[480px] p-0">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Active Alerts Panel</SheetTitle>
                    <SheetDescription>
                      View and manage active system alerts with recommended actions for the Risk Management platform.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="h-full flex flex-col bg-white">
                    {/* Clean Header - No Manual Close Icon (Sheet handles it) */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                          <h2 className="text-lg font-medium text-gray-900">Active Alerts</h2>
                        </div>
                        <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200 text-xs px-3 py-1 font-medium">
                          {activeAlerts.filter(alert => alert.severity === 'HIGH').length} High Priority
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Enhanced Alert List with Minimal Colors */}
                    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-blue-50 to-gray-50">
                      <div className="p-4 space-y-3">
                        {activeAlerts.map((alert, index) => (
                          <div 
                            key={alert.id} 
                            className={`p-4 bg-white rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all duration-200 ${
                              alert.severity === 'HIGH' 
                                ? 'border-l-red-500 hover:bg-red-50/30' 
                                : 'border-l-amber-500 hover:bg-amber-50/30'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                  alert.severity === 'HIGH' ? 'bg-red-500' : 'bg-amber-500'
                                }`}></div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-gray-900 text-sm leading-relaxed mb-1">
                                    {alert.title}
                                  </h3>
                                  <div className="flex items-center space-x-3">
                                    <p className="text-xs text-gray-500 flex items-center">
                                      <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      {alert.timestamp}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`text-xs font-medium ml-3 flex-shrink-0 ${
                                  alert.severity === 'HIGH' 
                                    ? 'border-red-300 text-red-700 bg-red-50' 
                                    : 'border-amber-300 text-amber-700 bg-amber-50'
                                }`}
                              >
                                {alert.severity}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      

                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}



            <Separator orientation="vertical" className="h-6" />

            {/* Enhanced Persona Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 px-3 py-2 h-auto hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-2">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      currentPersona === "analyst" ? 'bg-blue-100' : 
                      currentPersona === "vendor" ? 'bg-amber-100' : 'bg-green-100'
                    }`}>
                      {currentPersona === "analyst" ? (
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                      ) : currentPersona === "vendor" ? (
                        <Users className="h-4 w-4 text-amber-600" />
                      ) : (
                        <Shield className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-900">
                        {currentPersona === "analyst" ? "Jacob Corman" : 
                         currentPersona === "vendor" ? "Amazon Web Services" : "Michael Torres"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {currentPersona === "analyst" ? "Risk Analyst" : 
                         currentPersona === "vendor" ? "Vendor" : "Risk Manager"}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Switch Persona
                </div>
                <DropdownMenuItem 
                  onClick={() => onPersonaChange?.("analyst")}
                  className={`p-3 ${currentPersona === "analyst" ? "bg-blue-50" : ""}`}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-medium">Risk Analyst</span>
                      <span className="text-xs text-gray-500">Jacob Corman</span>
                    </div>
                    {currentPersona === "analyst" && (
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onPersonaChange?.("vendor")}
                  className={`p-3 ${currentPersona === "vendor" ? "bg-amber-50" : ""}`}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <Users className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-medium">Vendor</span>
                      <span className="text-xs text-gray-500">Amazon Web Services</span>
                    </div>
                    {currentPersona === "vendor" && (
                      <div className="h-2 w-2 rounded-full bg-amber-600" />
                    )}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onPersonaChange?.("manager")}
                  className={`p-3 ${currentPersona === "manager" ? "bg-green-50" : ""}`}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-medium">Risk Manager</span>
                      <span className="text-xs text-gray-500">Michael Torres</span>
                    </div>
                    {currentPersona === "manager" && (
                      <div className="h-2 w-2 rounded-full bg-green-600" />
                    )}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-3" onClick={handleSignOut}>
                  <div className="flex items-center space-x-3">
                    <LogOut className="h-4 w-4 text-gray-600" />
                    <span>Sign Out</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
});

export default NavigationHeader;