export class Decision {
    constructor(
        public id: number,
        public name: string,
        public created_by: string,
        public alias_name?: string,
        public description?: string
) { }
    }