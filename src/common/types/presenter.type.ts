export interface IPresenter<TModel, TResponseDto> {
  toResponseDto(model: TModel): TResponseDto;
  toResponseDtoList(models: TModel[]): TResponseDto[];
}
