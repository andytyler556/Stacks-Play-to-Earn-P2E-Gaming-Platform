import { describe, expect, it, beforeEach } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const alice = accounts.get('wallet_1')!;
const bob = accounts.get('wallet_2')!;
const charlie = accounts.get('wallet_3')!;

describe('Access Control Contract', () => {
  beforeEach(() => {
    // Deploy the contract before each test
    simnet.deployContract(
      'access-control',
      Cl.contractPrincipal(deployer, 'access-control'),
      deployer
    );
  });

  describe('User Registration', () => {
    it('should allow user registration with consumer role', () => {
      const response = simnet.callPublicFn(
        'access-control',
        'register-user',
        [],
        alice
      );

      expect(response.result).toBeOk(Cl.bool(true));

      // Check user data
      const userData = simnet.callReadOnlyFn(
        'access-control',
        'get-user',
        [Cl.principal(alice)],
        alice
      );

      expect(userData.result).toBeSome();
    });

    it('should prevent duplicate registration', () => {
      // Register once
      simnet.callPublicFn('access-control', 'register-user', [], alice);

      // Try to register again
      const response = simnet.callPublicFn(
        'access-control',
        'register-user',
        [],
        alice
      );

      expect(response.result).toBeErr(Cl.uint(104)); // err-already-registered
    });
  });

  describe('Role Verification', () => {
    beforeEach(() => {
      // Register users
      simnet.callPublicFn('access-control', 'register-user', [], alice);
      simnet.callPublicFn('access-control', 'register-user', [], bob);
    });

    it('should allow verification request for role upgrade', () => {
      const response = simnet.callPublicFn(
        'access-control',
        'request-verification',
        [
          Cl.uint(3), // ROLE-PROVIDER
          Cl.stringUtf8('ipfs://QmVerificationDocs')
        ],
        alice
      );

      expect(response.result).toBeOk(Cl.uint(1)); // Verification ID
    });

    it('should allow admin to verify users', () => {
      // Request verification
      simnet.callPublicFn(
        'access-control',
        'request-verification',
        [Cl.uint(3), Cl.stringUtf8('ipfs://QmDocs')],
        alice
      );

      // Verify as deployer (admin)
      const verifyResponse = simnet.callPublicFn(
        'access-control',
        'verify-user',
        [
          Cl.uint(1),
          Cl.bool(true),
          Cl.some(Cl.stringUtf8('Approved for provider role'))
        ],
        deployer
      );

      expect(verifyResponse.result).toBeOk(Cl.bool(true));

      // Check user role was upgraded
      const userRole = simnet.callReadOnlyFn(
        'access-control',
        'get-user-role',
        [Cl.principal(alice)],
        alice
      );

      expect(userRole.result).toBeSome(Cl.uint(3)); // ROLE-PROVIDER
    });
  });

  describe('Permission Checking', () => {
    beforeEach(() => {
      // Register and verify a provider
      simnet.callPublicFn('access-control', 'register-user', [], alice);
      simnet.callPublicFn(
        'access-control',
        'request-verification',
        [Cl.uint(3), Cl.stringUtf8('ipfs://QmDocs')],
        alice
      );
      simnet.callPublicFn(
        'access-control',
        'verify-user',
        [Cl.uint(1), Cl.bool(true), Cl.none()],
        deployer
      );
    });

    it('should check upload permissions correctly', () => {
      const canUpload = simnet.callPublicFn(
        'access-control',
        'can-upload-datasets',
        [Cl.principal(alice)],
        alice
      );

      expect(canUpload.result).toBeOk(Cl.bool(true));
    });

    it('should check purchase permissions correctly', () => {
      const canPurchase = simnet.callPublicFn(
        'access-control',
        'can-purchase-datasets',
        [Cl.principal(alice)],
        alice
      );

      expect(canPurchase.result).toBeOk(Cl.bool(true));
    });

    it('should deny permissions for unverified users', () => {
      // Register but don't verify bob
      simnet.callPublicFn('access-control', 'register-user', [], bob);

      const canUpload = simnet.callPublicFn(
        'access-control',
        'can-upload-datasets',
        [Cl.principal(bob)],
        bob
      );

      expect(canUpload.result).toBeOk(Cl.bool(false));
    });
  });

  describe('User Management', () => {
    beforeEach(() => {
      simnet.callPublicFn('access-control', 'register-user', [], alice);
    });

    it('should allow admin to ban users', () => {
      const banResponse = simnet.callPublicFn(
        'access-control',
        'ban-user',
        [
          Cl.principal(alice),
          Cl.stringUtf8('Violation of terms of service')
        ],
        deployer
      );

      expect(banResponse.result).toBeOk(Cl.bool(true));

      // Check if user is banned
      const isBanned = simnet.callReadOnlyFn(
        'access-control',
        'is-user-banned',
        [Cl.principal(alice)],
        alice
      );

      expect(isBanned.result).toBe(Cl.bool(true));
    });

    it('should allow admin to unban users', () => {
      // Ban first
      simnet.callPublicFn(
        'access-control',
        'ban-user',
        [Cl.principal(alice), Cl.stringUtf8('Test ban')],
        deployer
      );

      // Then unban
      const unbanResponse = simnet.callPublicFn(
        'access-control',
        'unban-user',
        [Cl.principal(alice)],
        deployer
      );

      expect(unbanResponse.result).toBeOk(Cl.bool(true));

      // Check if user is no longer banned
      const isBanned = simnet.callReadOnlyFn(
        'access-control',
        'is-user-banned',
        [Cl.principal(alice)],
        alice
      );

      expect(isBanned.result).toBe(Cl.bool(false));
    });
  });

  describe('Activity Tracking', () => {
    beforeEach(() => {
      simnet.callPublicFn('access-control', 'register-user', [], alice);
    });

    it('should update user activity', () => {
      const updateResponse = simnet.callPublicFn(
        'access-control',
        'update-user-activity',
        [
          Cl.principal(alice),
          Cl.stringAscii('upload'),
          Cl.uint(0)
        ],
        alice
      );

      expect(updateResponse.result).toBeOk(Cl.bool(true));

      // Check activity was recorded
      const activity = simnet.callReadOnlyFn(
        'access-control',
        'get-user-activity',
        [Cl.principal(alice)],
        alice
      );

      expect(activity.result).toBeSome();
    });
  });

  describe('Read-Only Functions', () => {
    beforeEach(() => {
      simnet.callPublicFn('access-control', 'register-user', [], alice);
    });

    it('should return role permissions', () => {
      const permissions = simnet.callReadOnlyFn(
        'access-control',
        'get-role-permissions',
        [Cl.uint(4)], // ROLE-CONSUMER
        alice
      );

      expect(permissions.result).toBeSome();
    });

    it('should check if user is verified', () => {
      const isVerified = simnet.callReadOnlyFn(
        'access-control',
        'is-user-verified',
        [Cl.principal(alice)],
        alice
      );

      expect(isVerified.result).toBe(Cl.bool(true)); // Consumers are auto-verified
    });
  });
});
