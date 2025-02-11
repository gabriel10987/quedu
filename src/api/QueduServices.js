import apiClient from './ApiClient';

class QueduServices {

    static async getLastQuedu(userId) {
        try {
            const response = await apiClient.post('/user/lastQuedu', { userId });
            return response.data;
        } catch (error) {
            throw this.handleError(error);  // Llamada al método handleError
        }
    }

    static async generateQuedu(formData){
        try {
            const response = await apiClient.post("/user/course/quedu/generateQuedu", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async createQueduInUser(queduInfo){
        try {
            const response = await apiClient.post("/user/course/quedu/new", queduInfo);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async updateQuedu(userId, queduId, solved, successPercentaje, attempt) {
        try {
            const response = await apiClient.put('/quedu/update', { userId, queduId, solved, successPercentaje, attempt });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getAllQuedusFormatted(userId){
        try {
            const response = await apiClient.get(`/user/allQuedus/${userId}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Define el método handleError
    static handleError(error) {
        console.error("Error en la solicitud:", error);
        return new Error("Ocurrió un error al procesar la solicitud.");
    }

    static async getPersonalQueduById(userId, courseId, queduId) {
        try {
            const response = await apiClient.get(`/user/quedu/${userId}/${courseId}/${queduId}`);
            console.log("------------------------------------------------------");
            console.log("mi respuesta de mi quedu solicitado: ", response.data);
            console.log("------------------------------------------------------");
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
}

export default QueduServices;
