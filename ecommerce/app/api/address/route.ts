import { NextResponse } from "next/server"
import { addressService } from "@/lib/services"

export async function GET() {
  try {
    const addresses = await addressService.getAddresses()
    return NextResponse.json(addresses)
  } catch (error) {
    console.error("Error fetching addresses:", error)
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { alias, type, residence_type, street, number, district, zip_code, city, state, country, complement } =
      await request.json()

    if (
      !alias ||
      !type ||
      !residence_type ||
      !street ||
      !number ||
      !district ||
      !zip_code ||
      !city ||
      !state ||
      !country
    ) {
      return NextResponse.json({ error: "Missing required address fields" }, { status: 400 })
    }

    const address = await addressService.createAddress(
      alias,
      type,
      residence_type,
      street,
      number,
      district,
      zip_code,
      city,
      state,
      country,
      complement,
    )

    return NextResponse.json(address)
  } catch (error) {
    console.error("Error creating address:", error)
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 })
  }
}
