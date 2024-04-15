
export class Navigation {
    name: string;
    iconName: string;
    routerLink: string;
    children?: Navigation[];
    activeOnPanels: string[];
    disabled: boolean;
    access: string;
  }