import { createPublicClient, http, type Chain, type Hex } from 'viem';
import { createPimlicoClient } from 'permissionless/clients/pimlico';
import { entryPoint07Address } from 'viem/account-abstraction';
import { createSmartAccountClient } from 'permissionless';
import { toSafeSmartAccount } from 'permissionless/accounts';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

export const PIMLICO_API_KEY = process.env.NEXT_PUBLIC_PIMLICO_API_KEY || '';

/**
 * Create a public client for interacting with the blockchain
 */
export function createPimlicoPublicClient(chain: Chain = base) {
  return createPublicClient({
    chain,
    transport: http(chain.rpcUrls.default.http[0]),
  });
}

/**
 * Create a Pimlico bundler/paymaster client
 */
export function createPimlicoBundlerClient(chain: Chain = base) {
  if (!PIMLICO_API_KEY) {
    throw new Error('NEXT_PUBLIC_PIMLICO_API_KEY is required');
  }

  const pimlicoUrl = `https://api.pimlico.io/v2/${chain.id}/rpc?apikey=${PIMLICO_API_KEY}`;

  return createPimlicoClient({
    chain,
    transport: http(pimlicoUrl),
    entryPoint: {
      address: entryPoint07Address,
      version: '0.7',
    },
  });
}

/**
 * Create a Safe smart account for a user
 *
 * @param userPrivateKey - The user's private key (can be generated or from wallet)
 * @param publicClient - The public client instance
 * @returns Smart account instance
 */
export async function createUserSmartAccount(
  userPrivateKey: Hex,
  publicClient: ReturnType<typeof createPimlicoPublicClient>
) {
  const owner = privateKeyToAccount(userPrivateKey);

  return toSafeSmartAccount({
    client: publicClient as any, // Type assertion for permissionless compatibility
    owners: [owner],
    entryPoint: {
      address: entryPoint07Address,
      version: '0.7',
    },
  });
}

/**
 * Create a smart account client that can send user operations
 *
 * @param account - The smart account instance
 * @param chain - The blockchain to operate on
 * @param pimlicoClient - The Pimlico bundler client
 * @returns Smart account client for sending transactions
 */
export async function createPimlicoSmartAccountClient(
  account: Awaited<ReturnType<typeof toSafeSmartAccount>>,
  chain: Chain = base,
  pimlicoClient: ReturnType<typeof createPimlicoBundlerClient>
) {
  const pimlicoUrl = `https://api.pimlico.io/v2/${chain.id}/rpc?apikey=${PIMLICO_API_KEY}`;

  return createSmartAccountClient({
    account,
    chain,
    bundlerTransport: http(pimlicoUrl),
    paymaster: pimlicoClient as any, // Type assertion needed for Pimlico client compatibility
    userOperation: {
      estimateFeesPerGas: async () => {
        return (await pimlicoClient.getUserOperationGasPrice()).fast;
      },
    },
  });
}

/**
 * Generate a deterministic private key for a user based on their address
 * This allows the same smart account to be derived for the same user
 *
 * WARNING: In production, consider using a more secure key derivation method
 * or storing keys encrypted on the backend
 */
export function generateUserPrivateKey(userAddress: string): Hex {
  // For demo purposes - in production, use a proper key management solution
  // This creates a deterministic key based on user address
  const hash = Array.from(userAddress)
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    .toString(16)
    .padStart(64, '0');

  return `0x${hash}` as Hex;
}

/**
 * Get or create a smart account address for a user
 * This is used to check if the user's smart account is deployed
 */
export async function getSmartAccountAddress(
  userPrivateKey: Hex,
  chain: Chain = base
): Promise<string> {
  const publicClient = createPimlicoPublicClient(chain);
  const account = await createUserSmartAccount(userPrivateKey, publicClient);
  return account.address;
}
