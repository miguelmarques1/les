import { CategoryOutputDTO } from "./category.dto";
import { PrecificationGroupOutputDTO } from "./precification-group.dto";

export class BookOutputDTO {
    public constructor(
        public id: number | null,
        public author: string,
        public categories: CategoryOutputDTO[],
        public year: number,
        public title: string,
        public publisher: string,
        public precification_group: PrecificationGroupOutputDTO,
        public edition: number,
        public pages: number,
        public synopsis: string,
        public height: number,
        public width: number,
        public weight: number,
        public depth: number,
        public isbn: string,
        public status: string,
    ) { }
}

export class BookInputDTO {
  public constructor(
    public author: string,
    public category_ids: number[],
    public year: number,
    public title: string,
    public publisher: string,
    public precification_group_id: number,
    public edition: number,
    public pages: number,
    public synopsis: string,
    public height: number,
    public width: number,
    public weight: number,
    public depth: number,
    public isbn: string,
    public status?: string,
  ) {}
}
