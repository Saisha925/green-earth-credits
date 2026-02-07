import fs from "node:fs/promises";
import path from "node:path";

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  image: string;
  pricePerTonne: number;
  country: string;
  category: string;
  vintage: number;
  verified: boolean;
  registry: string;
  credits: number;
  seller: {
    id: string | null;
    name: string;
    email: string | null;
  };
  certificate: Record<string, unknown> | null;
  authentication: Record<string, unknown> | null;
  createdAt: string;
}

const dataFilePath = path.join(process.cwd(), "server", "data", "listings.json");

export const readListings = async (): Promise<MarketplaceListing[]> => {
  try {
    const data = await fs.readFile(dataFilePath, "utf-8");
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed as MarketplaceListing[];
    }
    return [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

export const writeListings = async (listings: MarketplaceListing[]): Promise<void> => {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(listings, null, 2));
};
