export class BrandModel {
  id: number
  name: string
  imageUrl?: string

  constructor(id: number, name: string, imageUrl?: string) {
    this.id = id
    this.name = name
    this.imageUrl = imageUrl
  }

  static fromMap(map: any): BrandModel {
    return new BrandModel(map.id, map.name, map.image_url)
  }

  toMap(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      image_url: this.imageUrl,
    }
  }
}
