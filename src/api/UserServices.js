import apiClient from './ApiClient'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

class UserService {
  // Registro de usuario
  static async register(userData) {
    try {
      const response = await apiClient.post('/user', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Inicio de sesión
  static async login(credentials) {
    try {
      const response = await apiClient.post('/user/login', credentials);
      // Guardar el token en AsyncStorage
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Cerrar sesión
  static async logout() {
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  // Obtener ID del usuario del token
  static async getUserId() {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error("Token no disponible");
      }

      const decoded = jwtDecode(token);
      // debug
      // console.log("imprimiendo decode: ", decoded);
      const userId = decoded._id; // Ajusta 'userId' o 'sub' según el token
      return userId;
    } catch (error) {
      console.error("Error al obtener el ID del usuario", error);
      return null;
    }
  }

  // Obtener username del usuario del token
  static async getUserName() {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error("Token no disponible");
      }

      const decoded = jwtDecode(token);
      // debug
      //console.log("imprimiendo decode: ", decoded);
      const userName = decoded.username; // Ajusta 'userId' o 'sub' según el token
      return userName;
    } catch (error) {
      console.error("Error al obtener el ID del usuario", error);
      return null;
    }
  }

  // Obtener todos los usuarios (requiere autenticación)
  static async getUsers() {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener usuario por ID (requiere autenticación)
  static async getUserById(id) {
    try {
      const response = await apiClient.get(`/user/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getCoursesAndQuedus(userId){
    try {
      const response = await apiClient.get(`/user/quedus/${userId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Manejo de errores centralizado
  static handleError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message || 'Error en la petición',
      };
    } else if (error.request) {
      return {
        status: 503,
        message: 'No se pudo conectar con el servidor',
      };
    } else {
      return {
        status: 500,
        message: 'Error al procesar la petición',
      };
    }
  }

}

export default UserService;