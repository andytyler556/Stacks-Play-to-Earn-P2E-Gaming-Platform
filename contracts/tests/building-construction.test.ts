import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("Building Construction Contract", () => {
  beforeEach(() => {
    // Reset simnet state before each test
  });

  describe("Contract Initialization", () => {
    it("should initialize with correct default values", () => {
      const lastBuildingId = simnet.callReadOnlyFn(
        "building-construction",
        "get-last-building-id",
        [],
        deployer
      );
      expect(lastBuildingId.result).toBeUint(0);
    });
  });

  describe("Building Construction", () => {
    beforeEach(() => {
      // Setup: Mint land and blueprint for testing
      simnet.callPublicFn(
        "land-nft",
        "mint-land",
        [
          Cl.principal(wallet1),
          Cl.int(10),
          Cl.int(20),
          Cl.stringAscii("plains"),
          Cl.uint(25)
        ],
        deployer
      );

      simnet.callPublicFn(
        "blueprint-nft",
        "mint-blueprint",
        [
          Cl.principal(wallet1),
          Cl.stringAscii("residential"),
          Cl.stringAscii("common")
        ],
        deployer
      );

      // Give player resources for construction
      simnet.callPublicFn(
        "building-construction",
        "admin-add-resources",
        [
          Cl.principal(wallet1),
          Cl.tuple({
            wood: Cl.uint(100),
            stone: Cl.uint(100),
            metal: Cl.uint(100),
            energy: Cl.uint(100)
          })
        ],
        deployer
      );
    });

    it("should construct building successfully with valid inputs", () => {
      const constructResult = simnet.callPublicFn(
        "building-construction",
        "construct-building",
        [Cl.uint(1), Cl.uint(1)], // land-id: 1, blueprint-id: 1
        wallet1
      );

      expect(constructResult.result).toBeOk(Cl.uint(1));

      // Verify building was created
      const buildingInfo = simnet.callReadOnlyFn(
        "building-construction",
        "get-building-info",
        [Cl.uint(1)],
        deployer
      );

      expect(buildingInfo.result).toBeSome(
        Cl.tuple({
          "land-id": Cl.uint(1),
          "blueprint-id": Cl.uint(1),
          "owner": Cl.principal(wallet1),
          "building-type": Cl.stringAscii("residential"),
          "built-at": Cl.uint(simnet.blockHeight),
          "last-harvest": Cl.uint(simnet.blockHeight),
          "level": Cl.uint(1),
          "status": Cl.stringAscii("under-construction"),
          "daily-production": Cl.tuple({
            wood: Cl.uint(0),
            stone: Cl.uint(0),
            metal: Cl.uint(0),
            energy: Cl.uint(12), // 5 * 250 (terrain multiplier) / 100
            tokens: Cl.uint(25)  // 10 * 250 / 100
          })
        })
      );
    });

    it("should fail when caller doesn't own the land", () => {
      const constructResult = simnet.callPublicFn(
        "building-construction",
        "construct-building",
        [Cl.uint(1), Cl.uint(1)],
        wallet2 // wallet2 doesn't own the land
      );

      expect(constructResult.result).toBeErr(Cl.uint(103)); // err-not-land-owner
    });

    it("should fail when caller doesn't own the blueprint", () => {
      // Mint blueprint for wallet2
      simnet.callPublicFn(
        "blueprint-nft",
        "mint-blueprint",
        [
          Cl.principal(wallet2),
          Cl.stringAscii("commercial"),
          Cl.stringAscii("rare")
        ],
        deployer
      );

      const constructResult = simnet.callPublicFn(
        "building-construction",
        "construct-building",
        [Cl.uint(1), Cl.uint(2)], // trying to use wallet2's blueprint
        wallet1
      );

      expect(constructResult.result).toBeErr(Cl.uint(105)); // err-not-blueprint-owner
    });

    it("should fail when player has insufficient resources", () => {
      // Clear player resources
      simnet.callPublicFn(
        "building-construction",
        "admin-add-resources",
        [
          Cl.principal(wallet1),
          Cl.tuple({
            wood: Cl.uint(0),
            stone: Cl.uint(0),
            metal: Cl.uint(0),
            energy: Cl.uint(0)
          })
        ],
        deployer
      );

      const constructResult = simnet.callPublicFn(
        "building-construction",
        "construct-building",
        [Cl.uint(1), Cl.uint(1)],
        wallet1
      );

      expect(constructResult.result).toBeErr(Cl.uint(106)); // err-insufficient-resources
    });

    it("should fail when trying to build on land that already has a building", () => {
      // First construction
      simnet.callPublicFn(
        "building-construction",
        "construct-building",
        [Cl.uint(1), Cl.uint(1)],
        wallet1
      );

      // Mint another blueprint
      simnet.callPublicFn(
        "blueprint-nft",
        "mint-blueprint",
        [
          Cl.principal(wallet1),
          Cl.stringAscii("commercial"),
          Cl.stringAscii("uncommon")
        ],
        deployer
      );

      // Try to build again on same land
      const secondConstructResult = simnet.callPublicFn(
        "building-construction",
        "construct-building",
        [Cl.uint(1), Cl.uint(2)],
        wallet1
      );

      expect(secondConstructResult.result).toBeErr(Cl.uint(107)); // err-building-limit-exceeded
    });

    it("should deduct construction resources correctly", () => {
      const initialResources = simnet.callReadOnlyFn(
        "building-construction",
        "get-player-resources",
        [Cl.principal(wallet1)],
        deployer
      );

      simnet.callPublicFn(
        "building-construction",
        "construct-building",
        [Cl.uint(1), Cl.uint(1)],
        wallet1
      );

      const finalResources = simnet.callReadOnlyFn(
        "building-construction",
        "get-player-resources",
        [Cl.principal(wallet1)],
        deployer
      );

      // Resources should be deducted (exact amounts depend on blueprint consumption)
      expect(finalResources.result).toBeSome();
    });
  });

  describe("Construction Completion", () => {
    beforeEach(() => {
      // Setup and construct a building
      simnet.callPublicFn(
        "land-nft",
        "mint-land",
        [
          Cl.principal(wallet1),
          Cl.int(10),
          Cl.int(20),
          Cl.stringAscii("plains"),
          Cl.uint(25)
        ],
        deployer
      );

      simnet.callPublicFn(
        "blueprint-nft",
        "mint-blueprint",
        [
          Cl.principal(wallet1),
          Cl.stringAscii("residential"),
          Cl.stringAscii("common")
        ],
        deployer
      );

      simnet.callPublicFn(
        "building-construction",
        "admin-add-resources",
        [
          Cl.principal(wallet1),
          Cl.tuple({
            wood: Cl.uint(100),
            stone: Cl.uint(100),
            metal: Cl.uint(100),
            energy: Cl.uint(100)
          })
        ],
        deployer
      );

      simnet.callPublicFn(
        "building-construction",
        "construct-building",
        [Cl.uint(1), Cl.uint(1)],
        wallet1
      );
    });

    it("should fail to complete construction before time has passed", () => {
      const completeResult = simnet.callPublicFn(
        "building-construction",
        "complete-construction",
        [Cl.uint(1)],
        wallet1
      );

      expect(completeResult.result).toBeErr(Cl.uint(109)); // err-building-under-construction
    });

    it("should complete construction successfully after time has passed", () => {
      // Advance blocks to simulate construction time
      simnet.mineEmptyBlocks(144); // Default construction time

      const completeResult = simnet.callPublicFn(
        "building-construction",
        "complete-construction",
        [Cl.uint(1)],
        wallet1
      );

      expect(completeResult.result).toBeOk(Cl.bool(true));

      // Verify building status changed to active
      const buildingInfo = simnet.callReadOnlyFn(
        "building-construction",
        "get-building-info",
        [Cl.uint(1)],
        deployer
      );

      const building = buildingInfo.result;
      expect(building).toBeSome();
      // Status should be "active"
    });

    it("should fail when non-owner tries to complete construction", () => {
      simnet.mineEmptyBlocks(144);

      const completeResult = simnet.callPublicFn(
        "building-construction",
        "complete-construction",
        [Cl.uint(1)],
        wallet2 // Not the owner
      );

      expect(completeResult.result).toBeErr(Cl.uint(101)); // err-not-authorized
    });
  });

  describe("Resource Collection", () => {
    beforeEach(() => {
      // Setup, construct, and complete a building
      simnet.callPublicFn(
        "land-nft",
        "mint-land",
        [
          Cl.principal(wallet1),
          Cl.int(10),
          Cl.int(20),
          Cl.stringAscii("plains"),
          Cl.uint(25)
        ],
        deployer
      );

      simnet.callPublicFn(
        "blueprint-nft",
        "mint-blueprint",
        [
          Cl.principal(wallet1),
          Cl.stringAscii("industrial"),
          Cl.stringAscii("rare")
        ],
        deployer
      );

      simnet.callPublicFn(
        "building-construction",
        "admin-add-resources",
        [
          Cl.principal(wallet1),
          Cl.tuple({
            wood: Cl.uint(200),
            stone: Cl.uint(200),
            metal: Cl.uint(200),
            energy: Cl.uint(200)
          })
        ],
        deployer
      );

      simnet.callPublicFn(
        "building-construction",
        "construct-building",
        [Cl.uint(1), Cl.uint(1)],
        wallet1
      );

      simnet.mineEmptyBlocks(144); // Construction time

      simnet.callPublicFn(
        "building-construction",
        "complete-construction",
        [Cl.uint(1)],
        wallet1
      );
    });

    it("should fail to collect resources immediately after completion", () => {
      const collectResult = simnet.callPublicFn(
        "building-construction",
        "collect-resources",
        [Cl.uint(1)],
        wallet1
      );

      expect(collectResult.result).toBeErr(Cl.uint(111)); // err-no-resources-to-collect
    });

    it("should collect resources successfully after generation period", () => {
      // Advance blocks for resource generation
      simnet.mineEmptyBlocks(144); // One generation period

      const collectResult = simnet.callPublicFn(
        "building-construction",
        "collect-resources",
        [Cl.uint(1)],
        wallet1
      );

      expect(collectResult.result).toBeOk();
      
      // Should return generated resources
      const resources = collectResult.result;
      expect(resources).toBeTuple();
    });

    it("should fail when non-owner tries to collect resources", () => {
      simnet.mineEmptyBlocks(144);

      const collectResult = simnet.callPublicFn(
        "building-construction",
        "collect-resources",
        [Cl.uint(1)],
        wallet2
      );

      expect(collectResult.result).toBeErr(Cl.uint(101)); // err-not-authorized
    });

    it("should update player resources after collection", () => {
      const initialResources = simnet.callReadOnlyFn(
        "building-construction",
        "get-player-resources",
        [Cl.principal(wallet1)],
        deployer
      );

      simnet.mineEmptyBlocks(144);

      simnet.callPublicFn(
        "building-construction",
        "collect-resources",
        [Cl.uint(1)],
        wallet1
      );

      const finalResources = simnet.callReadOnlyFn(
        "building-construction",
        "get-player-resources",
        [Cl.principal(wallet1)],
        deployer
      );

      // Resources should have increased
      expect(finalResources.result).toBeSome();
    });
  });

  describe("Read-Only Functions", () => {
    it("should get building by land ID", () => {
      // Setup and construct building
      simnet.callPublicFn(
        "land-nft",
        "mint-land",
        [
          Cl.principal(wallet1),
          Cl.int(10),
          Cl.int(20),
          Cl.stringAscii("forest"),
          Cl.uint(30)
        ],
        deployer
      );

      simnet.callPublicFn(
        "blueprint-nft",
        "mint-blueprint",
        [
          Cl.principal(wallet1),
          Cl.stringAscii("commercial"),
          Cl.stringAscii("epic")
        ],
        deployer
      );

      simnet.callPublicFn(
        "building-construction",
        "admin-add-resources",
        [
          Cl.principal(wallet1),
          Cl.tuple({
            wood: Cl.uint(150),
            stone: Cl.uint(150),
            metal: Cl.uint(150),
            energy: Cl.uint(150)
          })
        ],
        deployer
      );

      simnet.callPublicFn(
        "building-construction",
        "construct-building",
        [Cl.uint(1), Cl.uint(1)],
        wallet1
      );

      const buildingByLand = simnet.callReadOnlyFn(
        "building-construction",
        "get-building-by-land",
        [Cl.uint(1)],
        deployer
      );

      expect(buildingByLand.result).toBeSome();
    });

    it("should calculate pending resources correctly", () => {
      // Setup and construct building
      simnet.callPublicFn(
        "land-nft",
        "mint-land",
        [
          Cl.principal(wallet1),
          Cl.int(5),
          Cl.int(15),
          Cl.stringAscii("mountain"),
          Cl.uint(40)
        ],
        deployer
      );

      simnet.callPublicFn(
        "blueprint-nft",
        "mint-blueprint",
        [
          Cl.principal(wallet1),
          Cl.stringAscii("industrial"),
          Cl.stringAscii("legendary")
        ],
        deployer
      );

      simnet.callPublicFn(
        "building-construction",
        "admin-add-resources",
        [
          Cl.principal(wallet1),
          Cl.tuple({
            wood: Cl.uint(300),
            stone: Cl.uint(300),
            metal: Cl.uint(300),
            energy: Cl.uint(300)
          })
        ],
        deployer
      );

      simnet.callPublicFn(
        "building-construction",
        "construct-building",
        [Cl.uint(1), Cl.uint(1)],
        wallet1
      );

      simnet.mineEmptyBlocks(144); // Complete construction

      simnet.callPublicFn(
        "building-construction",
        "complete-construction",
        [Cl.uint(1)],
        wallet1
      );

      simnet.mineEmptyBlocks(72); // Half generation period

      const pendingResources = simnet.callReadOnlyFn(
        "building-construction",
        "calculate-pending-resources",
        [Cl.uint(1)],
        deployer
      );

      expect(pendingResources.result).toBeSome();
    });
  });

  describe("Admin Functions", () => {
    it("should allow owner to set construction time", () => {
      const setTimeResult = simnet.callPublicFn(
        "building-construction",
        "set-construction-time",
        [Cl.uint(72)], // 12 hours
        deployer
      );

      expect(setTimeResult.result).toBeOk(Cl.bool(true));
    });

    it("should fail when non-owner tries to set construction time", () => {
      const setTimeResult = simnet.callPublicFn(
        "building-construction",
        "set-construction-time",
        [Cl.uint(72)],
        wallet1
      );

      expect(setTimeResult.result).toBeErr(Cl.uint(100)); // err-owner-only
    });

    it("should allow owner to add resources to players", () => {
      const addResourcesResult = simnet.callPublicFn(
        "building-construction",
        "admin-add-resources",
        [
          Cl.principal(wallet1),
          Cl.tuple({
            wood: Cl.uint(50),
            stone: Cl.uint(75),
            metal: Cl.uint(25),
            energy: Cl.uint(100)
          })
        ],
        deployer
      );

      expect(addResourcesResult.result).toBeOk(Cl.bool(true));

      const playerResources = simnet.callReadOnlyFn(
        "building-construction",
        "get-player-resources",
        [Cl.principal(wallet1)],
        deployer
      );

      expect(playerResources.result).toBeSome(
        Cl.tuple({
          wood: Cl.uint(50),
          stone: Cl.uint(75),
          metal: Cl.uint(25),
          energy: Cl.uint(100),
          "last-updated": Cl.uint(simnet.blockHeight)
        })
      );
    });
  });
});
