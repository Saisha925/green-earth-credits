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
  /** When set, certificate PDF was stored on Storacha (IPFS); link to view. */
  storachaUrl?: string | null;
  createdAt: string;
}

const dataDir = path.join(process.cwd(), "server", "data");
const dataFilePath = path.join(dataDir, "listings.json");
const storachaCidPath = path.join(dataDir, "storacha-listings-cid.txt");

async function getStorachaListingsCid(): Promise<string | null> {
  const envCid = process.env.STORACHA_LISTINGS_CID?.trim();
  if (envCid) return envCid;
  try {
    const cid = await fs.readFile(storachaCidPath, "utf-8");
    return cid.trim() || null;
  } catch {
    return null;
  }
}

export const readListings = async (): Promise<MarketplaceListing[]> => {
  const storachaCid = await getStorachaListingsCid();
  if (storachaCid) {
    try {
      const { fetchJsonFromStoracha } = await import("./storacha");
      // File was uploaded as listings.json under the directory CID
      const data = await fetchJsonFromStoracha(`${storachaCid}/listings.json`);
      if (Array.isArray(data)) return data as MarketplaceListing[];
    } catch (err) {
      console.error("[Listings] Storacha read failed, falling back to local:", (err as Error).message);
    }
  }

  try {
    const data = await fs.readFile(dataFilePath, "utf-8");
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) return parsed as MarketplaceListing[];
    return [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
};

export const writeListings = async (listings: MarketplaceListing[]): Promise<void> => {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(listings, null, 2));

  const { uploadJsonToStoracha } = await import("./storacha");
  const result = await uploadJsonToStoracha(listings, "listings.json");
  if (result) {
    try {
      await fs.writeFile(storachaCidPath, result.cid, "utf-8");
    } catch (err) {
      console.error("[Listings] Could not save Storacha CID pointer:", (err as Error).message);
    }
  }
};
