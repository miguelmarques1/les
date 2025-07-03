export class PrecificationGroup {
  id?: number
  name: string
  profitPercentage: number

  constructor(name: string, profitPercentage: number, id?: number) {
    this.id = id
    this.name = name
    this.profitPercentage = profitPercentage
  }

  static fromMap(map: any): PrecificationGroup {
    return new PrecificationGroup(map.name, map.profit_percentage, map.id)
  }

  toMap(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      profit_percentage: this.profitPercentage,
    }
  }
}
