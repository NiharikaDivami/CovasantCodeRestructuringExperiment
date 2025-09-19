
export interface BreadcrumbItem {
    label: string;
    href?: string;
    onClick?: () => void;
}

export interface NavigationBreadcrumbProps {
    items: BreadcrumbItem[];
    onBack?: () => void;
    backLabel?: string;
}