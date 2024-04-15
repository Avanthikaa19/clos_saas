export class TMRModule {
    constructor (
        public name: string,
        public description: string,
        public routerLink: string,
        public icon: string,
        public styleClass: string,
        public color: string,
        public wip: boolean
    ) {}
}