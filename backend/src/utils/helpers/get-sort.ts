import { PaginationParams } from '../../modules/admin/dto/pagination-params.dto';

export const getSort = (query: PaginationParams, tableName: string) => {
  return query.sort.includes('.') ? query.sort : tableName + '.' + query.sort;
};
