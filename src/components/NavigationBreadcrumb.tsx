import { Button } from "./ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { ArrowLeft } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface NavigationBreadcrumbProps {
  items: BreadcrumbItem[];
  onBack?: () => void;
  backLabel?: string;
}

export default function NavigationBreadcrumb({ 
  items, 
  onBack, 
  backLabel = "Back" 
}: NavigationBreadcrumbProps) {
  return (
    <div className="bg-white border-b px-10 py-4 flex-shrink-0">
      <div className="flex items-center space-x-4">
        {/* Back Button */}
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backLabel}
          </Button>
        )}
        
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((item, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index === items.length - 1 ? (
                    // Last item is current page
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    // Other items are clickable links
                    <BreadcrumbLink 
                      asChild={!!item.onClick}
                      href={item.href}
                      onClick={item.onClick}
                      className="cursor-pointer"
                    >
                      {item.onClick ? (
                        <button type="button">{item.label}</button>
                      ) : (
                        item.label
                      )}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}