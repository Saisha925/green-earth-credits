/**
 * Storacha (Web3.Storage) integration for decentralized file storage.
 * Uses "Bring your own delegations" for backend: set STORACHA_KEY and STORACHA_PROOF in env.
 * See: https://docs.storacha.network/how-to/upload/#bring-your-own-delegations
 */

const GATEWAY_BASE = "https://storacha.link/ipfs";

let clientInstance: Awaited<ReturnType<typeof createStorachaClient>> | null = null;

type StorachaClient = {
  uploadFile: (blob: Blob) => Promise<{ toString: () => string }>;
  uploadDirectory: (files: File[]) => Promise<{ toString: () => string }>;
};

async function createStorachaClient(): Promise<StorachaClient | null> {
  const key = process.env.STORACHA_KEY;
  const proofBase64 = process.env.STORACHA_PROOF;
  if (!key || !proofBase64) return null;

  try {
    const mod = await import("@storacha/client");
    const Client = mod.default ?? mod;
    const create = Client.create;
    if (typeof create !== "function") return null;

    const storeMod = await import("@storacha/client/stores/memory");
    const StoreMemory = storeMod.StoreMemory ?? storeMod.default;
    const proofMod = await import("@storacha/client/proof");
    const Proof = proofMod.default ?? proofMod;
    const signerMod = await import("@storacha/client/principal/ed25519");
    const Signer = signerMod.Signer ?? signerMod.default;

    const principal = Signer.parse(key);
    const store = new StoreMemory();
    const client = (await create({ principal, store })) as StorachaClient;
    const proof = await Proof.parse(proofBase64);
    const space = await client.addSpace(proof as never);
    await client.setCurrentSpace(space.did());
    return client;
  } catch (err) {
    console.error("[Storacha] Failed to create client:", (err as Error).message);
    return null;
  }
}

export async function getStorachaClient(): Promise<StorachaClient | null> {
  if (clientInstance === undefined) {
    clientInstance = await createStorachaClient();
  }
  return clientInstance;
}

/**
 * Upload a buffer to Storacha (e.g. certificate PDF). Returns gateway URL or null.
 */
export async function uploadToStoracha(
  buffer: Buffer,
  filename: string,
  mimeType = "application/pdf"
): Promise<{ cid: string; url: string } | null> {
  const client = await getStorachaClient();
  if (!client) return null;

  try {
    const file = new File([buffer], filename, { type: mimeType });
    const cid = await client.uploadDirectory([file]);
    const cidStr = typeof cid === "string" ? cid : (cid as { toString: () => string }).toString();
    const url = `${GATEWAY_BASE}/${cidStr}/${encodeURIComponent(filename)}`;
    return { cid: cidStr, url };
  } catch (err) {
    console.error("[Storacha] Upload failed:", (err as Error).message);
    return null;
  }
}

/**
 * Upload JSON data to Storacha. Returns gateway URL or null.
 */
export async function uploadJsonToStoracha(
  data: unknown,
  filename = "data.json"
): Promise<{ cid: string; url: string } | null> {
  const client = await getStorachaClient();
  if (!client) return null;

  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const file = new File([blob], filename, { type: "application/json" });
    const cid = await client.uploadDirectory([file]);
    const cidStr = typeof cid === "string" ? cid : (cid as { toString: () => string }).toString();
    const url = `${GATEWAY_BASE}/${cidStr}/${encodeURIComponent(filename)}`;
    return { cid: cidStr, url };
  } catch (err) {
    console.error("[Storacha] Upload failed:", (err as Error).message);
    return null;
  }
}

/**
 * Fetch JSON from a Storacha/IPFS gateway URL or CID.
 */
export async function fetchJsonFromStoracha(cidOrUrl: string): Promise<unknown> {
  const url = cidOrUrl.startsWith("http") ? cidOrUrl : `${GATEWAY_BASE}/${cidOrUrl}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Storacha fetch failed: ${res.status}`);
  return res.json();
}
