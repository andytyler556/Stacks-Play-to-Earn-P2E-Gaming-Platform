import { describe, expect, it, beforeEach } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const alice = accounts.get('wallet_1')!;
const bob = accounts.get('wallet_2')!;
const charlie = accounts.get('wallet_3')!;

describe('Dataset Registry Contract', () => {
  beforeEach(() => {
    // Deploy the contract before each test
    simnet.deployContract(
      'dataset-registry',
      Cl.contractPrincipal(deployer, 'dataset-registry'),
      deployer
    );
  });

  describe('Dataset Registration', () => {
    it('should allow low-value dataset registration without multi-sig', () => {
      const response = simnet.callPublicFn(
        'dataset-registry',
        'register-dataset',
        [
          Cl.stringUtf8('ipfs://QmTest123'),
          Cl.uint(500000), // 0.5 STX - below multi-sig threshold
          Cl.stringUtf8('{"name": "Test Dataset", "description": "A test dataset"}'),
          Cl.uint(500) // 5% royalty
        ],
        alice
      );

      expect(response.result).toBeOk(Cl.uint(1));
    });

    it('should require multi-sig for high-value dataset registration', () => {
      const response = simnet.callPublicFn(
        'dataset-registry',
        'register-dataset',
        [
          Cl.stringUtf8('ipfs://QmTest456'),
          Cl.uint(2000000), // 2 STX - above multi-sig threshold
          Cl.stringUtf8('{"name": "Premium Dataset", "description": "A premium dataset"}'),
          Cl.uint(1000) // 10% royalty
        ],
        alice
      );

      // Should create a proposal instead of direct registration
      expect(response.result).toBeOk(Cl.uint(1)); // Proposal ID
    });

    it('should reject invalid royalty rates', () => {
      const response = simnet.callPublicFn(
        'dataset-registry',
        'register-dataset',
        [
          Cl.stringUtf8('ipfs://QmTest789'),
          Cl.uint(500000),
          Cl.stringUtf8('{"name": "Invalid Dataset"}'),
          Cl.uint(1500) // 15% royalty - too high
        ],
        alice
      );

      expect(response.result).toBeErr(Cl.uint(113));
    });
  });

  describe('Multi-Signature Authorization', () => {
    beforeEach(() => {
      // Add authorized signers
      simnet.callPublicFn(
        'dataset-registry',
        'add-authorized-signer',
        [Cl.principal(alice)],
        deployer
      );
      simnet.callPublicFn(
        'dataset-registry',
        'add-authorized-signer',
        [Cl.principal(bob)],
        deployer
      );
    });

    it('should allow authorized signers to sign proposals', () => {
      // Create a high-value proposal first
      const proposalResponse = simnet.callPublicFn(
        'dataset-registry',
        'register-dataset',
        [
          Cl.stringUtf8('ipfs://QmHighValue'),
          Cl.uint(2000000),
          Cl.stringUtf8('{"name": "High Value Dataset"}'),
          Cl.uint(500)
        ],
        charlie
      );

      const proposalId = proposalResponse.result;
      expect(proposalId).toBeOk(Cl.uint(1));

      // Sign the proposal
      const signResponse = simnet.callPublicFn(
        'dataset-registry',
        'sign-proposal',
        [Cl.uint(1)],
        alice
      );

      expect(signResponse.result).toBeOk(Cl.bool(true));
    });

    it('should execute proposal with sufficient signatures', () => {
      // Create proposal
      simnet.callPublicFn(
        'dataset-registry',
        'register-dataset',
        [
          Cl.stringUtf8('ipfs://QmExecutable'),
          Cl.uint(2000000),
          Cl.stringUtf8('{"name": "Executable Dataset"}'),
          Cl.uint(500)
        ],
        charlie
      );

      // Get signatures from authorized signers
      simnet.callPublicFn('dataset-registry', 'sign-proposal', [Cl.uint(1)], alice);
      simnet.callPublicFn('dataset-registry', 'sign-proposal', [Cl.uint(1)], bob);

      // Execute proposal
      const executeResponse = simnet.callPublicFn(
        'dataset-registry',
        'execute-proposal',
        [Cl.uint(1)],
        alice
      );

      expect(executeResponse.result).toBeOk(Cl.uint(1)); // Dataset ID
    });
  });

  describe('Access Control', () => {
    it('should grant access to datasets', () => {
      // Register a dataset first
      simnet.callPublicFn(
        'dataset-registry',
        'register-dataset',
        [
          Cl.stringUtf8('ipfs://QmAccess'),
          Cl.uint(500000),
          Cl.stringUtf8('{"name": "Access Test"}'),
          Cl.uint(500)
        ],
        alice
      );

      // Grant access
      const grantResponse = simnet.callPublicFn(
        'dataset-registry',
        'grant-access',
        [Cl.uint(1), Cl.principal(bob)],
        alice
      );

      expect(grantResponse.result).toBeOk(Cl.bool(true));

      // Check access
      const hasAccess = simnet.callReadOnlyFn(
        'dataset-registry',
        'has-access',
        [Cl.uint(1), Cl.principal(bob)],
        alice
      );

      expect(hasAccess.result).toBe(Cl.bool(true));
    });
  });

  describe('Read-Only Functions', () => {
    it('should return dataset information', () => {
      // Register a dataset
      simnet.callPublicFn(
        'dataset-registry',
        'register-dataset',
        [
          Cl.stringUtf8('ipfs://QmReadTest'),
          Cl.uint(500000),
          Cl.stringUtf8('{"name": "Read Test Dataset"}'),
          Cl.uint(500)
        ],
        alice
      );

      // Get dataset info
      const datasetInfo = simnet.callReadOnlyFn(
        'dataset-registry',
        'get-dataset',
        [Cl.uint(1)],
        alice
      );

      expect(datasetInfo.result).toBeSome();
    });

    it('should return signature threshold', () => {
      const threshold = simnet.callReadOnlyFn(
        'dataset-registry',
        'get-signature-threshold',
        [],
        alice
      );

      expect(threshold.result).toBe(Cl.uint(2));
    });
  });
});
