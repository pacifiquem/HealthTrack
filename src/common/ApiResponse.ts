export class SuccessfulApiResponse {
    constructor(
        private success: boolean = true,
        private data: unknown
    ) {}
}

export class UnSuccessfulApiResponse {
    constructor(
        private success: boolean = false,
        private message: string
    ) {}
}