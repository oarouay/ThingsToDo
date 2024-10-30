import axios from 'axios';

export const fetchUserTodos = async () => {
  try {
    const response = await axios.get("http://localhost:3000/auth/todos");
    
    if (response.data.status) {
      return {
        success: true,
        data: response.data.todoLists,
        error: null
      };
    } else {
      return {
        success: false,
        data: [],
        error: "Failed to fetch todos"
      };
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error.message
    };
  }
}