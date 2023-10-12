class ApiResponse {
    constructor (message, success, data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}

export default ApiResponse;