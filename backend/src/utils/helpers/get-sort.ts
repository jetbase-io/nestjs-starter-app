import { PaginationParams } from '../../modules/admin/dto/pagination-params.dto';

export const getSort = (query: PaginationParams, tableName: string) => {
  if (query.sort) 
    return query.sort.includes('.') ? query.sort : tableName + '.' + query.sort;
  return null
};
