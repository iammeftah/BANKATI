// src/components/sidebar/menu/types.ts
export interface MenuProps {
    currentPath: string;
}

export interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
}

export interface MenuSectionProps {
    title: string;
    items: MenuItem[];
    currentPath: string;
    onItemClick: (path: string) => void;
}