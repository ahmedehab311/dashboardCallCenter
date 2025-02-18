// apiService.js
import apiInstance from "./axiosInstance";
import { toast } from "react-hot-toast";
const pathMappings = {
  languages: "languages/locales",
};
const getApiPath = (path) => pathMappings[path] || path;

export const deleteItem = async (path, id) => {
  try {
    const response = await apiInstance.delete(
      `/panel/${getApiPath(path)}/${id}`
    );
    const messages = response.data.messages || response.data.data;

    if (messages.length > 0) {
      toast.success(messages[0]);
    }
    // console.log(response.data);

    return response.data;
  } catch (error) {
    toast.error(
      `Failed to delete ${path}: ${
        error.response?.data?.message || error.message
      }`
    );
    throw error;
  }
};

export const editItem = async (path, id, data) => {
  try {
    const response = await apiInstance.put(
      `/panel/${getApiPath(path)}/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const messages = response.data.messages || [];
    if (messages.length > 0) {
      toast.success(messages[0]);
    }
    return response.data;
  } catch (error) {
    toast.error(
      `Failed to edit ${path}: ${
        error.response?.data?.message || error.message
      }`
    );
    console.error("Error response:", error.response); // لو حصل خطأ يمكنك التحقق من الاستجابة هنا
    throw error;
  }
};

export const addItem = async (path, data) => {
  try {
    const response = await apiInstance.post(`/panel/${getApiPath(path)}`, data);
    const messages = response.data.messages || [];

    if (messages.length > 0) {
      toast.success(messages[0]);
    }

    return response.data;
  } catch (error) {
    toast.error(
      `Failed to add ${path}: ${error.response?.data?.message || error.message}`
    );
    throw error;
  }
};
export const fetchItems = (path) =>
  apiInstance.get(`/panel/${getApiPath(path)}`);

export const fetchItemData = (path, id) =>
  apiInstance.get(`/panel/${path}/${id}`);


export const updateMedia = async (path, id, formData) => {
  try {
    const response = await apiInstance.post(
      `/panel/${getApiPath(path)}/${id}/update-media`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const messages = response.data.messages || [];
    if (messages.length > 0) {
      toast.success(messages[0]);
    }
    return response.data;
  } catch (error) {
    toast.error(
      `Failed to update media for ${path}: ${
        error.response?.data?.message || error.message
      }`
    );
    throw error;
  }
};



export const updateStatus = async (path, ids, status) => {
  try {
    // console.log(
    //   `Updating status for ${path} with ids:`,
    //   ids,
    //   `and status:`,
    //   status
    // );

    const requestBody = {
      ids,
      status,
    };

    const response = await apiInstance.patch(
      `/panel/${getApiPath(path)}/update-status`,
      requestBody
    );

    if (
      response.data &&
      response.data.messages &&
      response.data.messages.length > 0
    ) {
      toast.success(`${response.data.messages.join(", ")}`);
    } else {
      toast.info("No status updates available.");
    }

    return response.data;
  } catch (error) {
    toast.error(
      `Failed to update status for ${path}: ${
        error.response?.data?.message || error.message
      }`
    );
    throw error;
  }
};
export const updateStatusPushUpdate = async (path, ids, updateStatus) => {
  try {
    // console.log(
    //   `Updating status for ${path} with ids:`,
    //   ids,
    //   `andupdateStatus,:`,
    //   updateStatus
    // );

    const requestBody = {
      ids,
      updateStatus,
    };

    const response = await apiInstance.patch(
      `/panel/${getApiPath(path)}/update-push-update-status`,
      requestBody
    );

    if (
      response.data &&
      response.data.messages &&
      response.data.messages.length > 0
    ) {
      toast.success(`${response.data.messages.join(", ")}`);
    } else {
      toast.info("No status updates available.");
    }

    return response.data;
  } catch (error) {
    toast.error(
      `Failed to update status for ${path}: ${
        error.response?.data?.message || error.message
      }`
    );
    throw error;
  }
};
// export const updateStatusDevices = async (path, ids, updateStatus) => {
//   try {
//     // console.log(
//     //   `Updating status for ${path} with ids:`,
//     //   ids,
//     //   `andupdateStatus,:`,
//     //   updateStatus
//     // );

//     const requestBody = {
//       ids,
//       updateStatus,
//     };

//     const response = await apiInstance.patch(
//       `/panel/${getApiPath(path)}/update-`,
//       requestBody
//     );

//     if (
//       response.data &&
//       response.data.messages &&
//       response.data.messages.length > 0
//     ) {
//       toast.success(`${response.data.messages.join(", ")}`);
//     } else {
//       toast.info("No status updates available.");
//     }

//     return response.data;
//   } catch (error) {
//     toast.error(
//       `Failed to update status for ${path}: ${
//         error.response?.data?.message || error.message
//       }`
//     );
//     throw error;
//   }
// };
