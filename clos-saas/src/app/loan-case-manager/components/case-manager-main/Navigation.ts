// FOR BREADCRUMBS
export class Navigation {
    name: string;
    iconName: string;
    routerLink: string;
    children: Navigation[];
    activeOnPanels?: string[];
    disabled?: boolean;
    access: boolean;
    isOpen?:boolean;
  }
  export class ToolNavigation {
    label: string;
    icon: string;
    access: string;
  }
  export class ActivePanelPath {
    path: string;
    activePanel: string;
    breadCrumbs: any[];
  }
  