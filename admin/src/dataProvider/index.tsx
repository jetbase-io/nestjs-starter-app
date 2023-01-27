import { DataProvider, DeleteParams, GetManyReferenceParams, UpdateManyParams } from "react-admin";

import http from "../auth/http-common";

const SERVICE_URL = `${process.env.REACT_APP_API_URL}/admin` || "http://localhost:5000/api/admin";

const getList = async (path: string, { pagination, sort }: any): Promise<any> => {
  const offset = (pagination.page - 1) * pagination.perPage;
  let url = `${SERVICE_URL}/${path}?page=${offset}&limit=${pagination.perPage}`;
  if (sort) url += `&sort=${sort.field}&order=${sort.order}`;
  const response = await http.get(url, { proxy: false });
  return { data: response.status === 200 ? response?.data?.items : [], total: response?.data?.count };
};

// eslint-disable-next-line consistent-return
const getOne = async (path: string, params: any): Promise<any> => {
  const response = await http.get(`${SERVICE_URL}/${path}/${params.id}`, { proxy: false });
  if (response.status === 200) {
    // eslint-disable-next-line no-underscore-dangle
    return { data: { ...(response?.data || []), id: response.data._id } };
  }
};

// eslint-disable-next-line consistent-return
const create = async (path: string, data: any): Promise<any> => {
  const response = await http.post(`${SERVICE_URL}/${path}`, data.data, { proxy: false });
  if (response.status === 201) {
    // eslint-disable-next-line no-underscore-dangle
    return { data: { ...response?.data, id: response.data._id } };
  }
};

// eslint-disable-next-line consistent-return
const update = async (path: string, data: any): Promise<any> => {
  if (path === "users") {
    delete data.data.email;
    delete data.data.avatar;
    delete data.data.roles;
    delete data.data.subscriptionId;
    delete data.data.customerStripeId;
  }
  delete data.data.updated_at;
  delete data.data.created_at;
  delete data.data.id;
  delete data.data.internalComment;

  // eslint-disable-next-line no-underscore-dangle
  // eslint-disable-next-line no-underscore-dangle

  const response = await http.put(`${SERVICE_URL}/${path}/${data.id}`, data.data, { proxy: false });
  if (response.status === 200) {
    // eslint-disable-next-line no-underscore-dangle
    return { data: { ...response?.data, id: response.data._id } };
  }
};

// eslint-disable-next-line consistent-return
const deleteOne = async (path: string, params: any): Promise<any> => {
  const response = await http.delete(`${SERVICE_URL}/${path}/${params.id}`, { proxy: false });
  if (response.status === 201) {
    // eslint-disable-next-line no-underscore-dangle
    return { data: { ...response?.data, id: response.data._id } };
  }
};

// eslint-disable-next-line consistent-return
const deleteMany = async (path: string, params: any): Promise<any> => {
  const response = await http.delete(`${SERVICE_URL}/${path}/delete`, { proxy: false, data: { ids: params.ids } });
  if (response.status === 200) {
    return { data: params.ids };
  }
};

// eslint-disable-next-line consistent-return
const getMany = async (path: string, params: any): Promise<any> => {
  const response = await http.post(
    `${SERVICE_URL}/${path}/many`,
    { ids: params.ids },
    { proxy: false, data: { ids: params.ids } }
  );
  if (response.status === 200) {
    return { data: response?.data || [], total: response?.data.length };
    // return { data: response?.data.map((d: any) => ({ ...d, id: d._id })) || [], total: response?.data.length };
  }
};

const getManyReference = async (resource: string, params: GetManyReferenceParams): Promise<any> => {
  return [];
};
const updateMany = async (resource: string, params: UpdateManyParams<any>): Promise<any> => {
  return [];
};

const deleteProvider = async (resource: string, params: DeleteParams<any>): Promise<any> => {
  return [];
};

export const dataProvider: DataProvider = {
  getList,
  getOne,
  getMany,
  create,
  update,
  deleteOne,
  deleteMany,
  getManyReference,
  updateMany,
  delete: deleteProvider,
};
