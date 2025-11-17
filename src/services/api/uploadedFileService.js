import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const tableName = 'uploaded_file_c';

/**
 * Fetch all uploaded files with pagination and filtering
 */
export const getAll = async (options = {}) => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      throw new Error('ApperClient not initialized');
    }

    const { limit = 20, offset = 0 } = options;

    const params = {
      fields: [
        { field: { Name: 'Id' } },
        { field: { Name: 'Name' } },
        { field: { Name: 'Tags' } },
        { field: { Name: 'Owner' } },
        { field: { Name: 'CreatedOn' } },
        { field: { Name: 'CreatedBy' } },
        { field: { Name: 'ModifiedOn' } },
        { field: { Name: 'ModifiedBy' } },
        { field: { Name: 'name_c' } },
        { field: { Name: 'size_c' } },
        { field: { Name: 'type_c' } },
        { field: { Name: 'preview_c' } },
        { field: { Name: 'status_c' } },
        { field: { Name: 'file_content_c' } }
      ],
      pagingInfo: {
        limit,
        offset
      }
    };

    const response = await apperClient.fetchRecords(tableName, params);

    if (!response.success) {
      console.error(`Failed to fetch uploaded files:`, response);
      return [];
    }

    if (!response?.data?.length) {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching uploaded files:', error?.message || error);
    return [];
  }
};

/**
 * Fetch a single file by ID
 */
export const getById = async (fileId) => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      throw new Error('ApperClient not initialized');
    }

    const params = {
      fields: [
        { field: { Name: 'Id' } },
        { field: { Name: 'Name' } },
        { field: { Name: 'Tags' } },
        { field: { Name: 'Owner' } },
        { field: { Name: 'CreatedOn' } },
        { field: { Name: 'CreatedBy' } },
        { field: { Name: 'ModifiedOn' } },
        { field: { Name: 'ModifiedBy' } },
        { field: { Name: 'name_c' } },
        { field: { Name: 'size_c' } },
        { field: { Name: 'type_c' } },
        { field: { Name: 'preview_c' } },
        { field: { Name: 'status_c' } },
        { field: { Name: 'file_content_c' } }
      ]
    };

    const response = await apperClient.getRecordById(tableName, fileId, params);

    if (!response.success) {
      console.error(`Failed to fetch file with Id: ${fileId}:`, response);
      return null;
    }

    return response.data || null;
  } catch (error) {
    console.error(`Error fetching file ${fileId}:`, error?.message || error);
    return null;
  }
};

/**
 * Create a new uploaded file record
 */
export const create = async (fileData) => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      throw new Error('ApperClient not initialized');
    }

    // Map UI properties to database field names
    const payload = {
      records: [
        {
          Name: fileData.name || fileData.name_c,
          name_c: fileData.name || fileData.name_c,
          size_c: fileData.size || fileData.size_c,
          type_c: fileData.type || fileData.type_c,
          preview_c: fileData.preview || fileData.preview_c,
          status_c: fileData.status || fileData.status_c || 'idle',
          Tags: fileData.tags ? (Array.isArray(fileData.tags) ? fileData.tags.join(',') : fileData.tags) : ''
        }
      ]
    };

    const response = await apperClient.createRecord(tableName, payload);

    if (!response.success) {
      console.error(`Failed to create uploaded file:`, response);
      return null;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);

      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} file records:`, failed);
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
      }

      if (successful.length > 0) {
        return successful[0].data;
      }
    }

    return null;
  } catch (error) {
    console.error('Error creating file record:', error?.message || error);
    return null;
  }
};

/**
 * Update an uploaded file record
 */
export const update = async (fileId, fileData) => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      throw new Error('ApperClient not initialized');
    }

    // Map UI properties to database field names
    const payload = {
      records: [
        {
          Id: fileId,
          Name: fileData.name || fileData.name_c,
          name_c: fileData.name || fileData.name_c,
          size_c: fileData.size || fileData.size_c,
          type_c: fileData.type || fileData.type_c,
          preview_c: fileData.preview || fileData.preview_c,
          status_c: fileData.status || fileData.status_c,
          Tags: fileData.tags ? (Array.isArray(fileData.tags) ? fileData.tags.join(',') : fileData.tags) : ''
        }
      ]
    };

    const response = await apperClient.updateRecord(tableName, payload);

    if (!response.success) {
      console.error(`Failed to update uploaded file:`, response);
      return null;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);

      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} file records:`, failed);
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
      }

      if (successful.length > 0) {
        return successful[0].data;
      }
    }

    return null;
  } catch (error) {
    console.error('Error updating file record:', error?.message || error);
    return null;
  }
};

/**
 * Delete an uploaded file record
 */
export const deleteFile = async (fileId) => {
  try {
    const apperClient = getApperClient();
    if (!apperClient) {
      throw new Error('ApperClient not initialized');
    }

    const response = await apperClient.deleteRecord(tableName, {
      RecordIds: [fileId]
    });

    if (!response.success) {
      console.error(`Failed to delete uploaded file:`, response);
      return false;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);

      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} file records:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }

      return successful.length === 1;
    }

    return false;
  } catch (error) {
    console.error('Error deleting file record:', error?.message || error);
    return false;
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  deleteFile
};