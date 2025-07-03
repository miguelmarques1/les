export class CategoryModel {
  constructor(public id: number, public name: string) { }

  static fromMap(map: any): CategoryModel {
    return new CategoryModel(map.id, map.name)
  }

  toMap(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
    }
  }
}