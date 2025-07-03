export class Dimensions {
  width: number
  height: number
  depth: number
  weight: number

  constructor(width: number, height: number, depth: number, weight: number) {
    this.width = width
    this.height = height
    this.depth = depth
    this.weight = weight
  }

  static fromMap(map: any): Dimensions {
    return new Dimensions(map.width, map.height, map.depth, map.weight)
  }

  toMap(): Record<string, any> {
    return {
      width: this.width,
      height: this.height,
      depth: this.depth,
      weight: this.weight,
    }
  }
}
