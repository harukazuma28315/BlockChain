// ====================== BLOCKCHAIN.JS ======================
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./config.js";
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.13.1/+esm";

let provider;
let signer;
let contract;
let currentAddress = null;
let isAdminGlobal = false;

// ====================== KẾT NỐI ======================
export async function connectWallet() {
  if (!window.ethereum) {
    alert("Vui lòng cài MetaMask!");
    return null;
  }

  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    currentAddress = (await signer.getAddress()).toLowerCase();
    console.log("✅ Connected:", currentAddress);

    // Kiểm tra Admin
    try {
      const ownerAddress = (await contract.owner()).toLowerCase();
      isAdminGlobal = ownerAddress === currentAddress;
      console.log("Owner từ contract:", ownerAddress);
    } catch (e) {
      console.warn("Không gọi được owner(), fallback Admin");
      isAdminGlobal =
        currentAddress ===
        "0xa1b517e141f6d7be60555dfabcf27fdc536c20aa".toLowerCase();
    }

    console.log("👑 Role:", isAdminGlobal ? "ADMIN" : "VOTER");

    return {
      address: currentAddress,
      isAdmin: isAdminGlobal,
      contract,
      signer,
    };
  } catch (error) {
    console.error("❌ Kết nối thất bại:", error);
    alert("Kết nối MetaMask thất bại!");
    return null;
  }
}

// ====================== DISCONNECT ======================
export function disconnectWallet() {
  provider = signer = contract = null;
  currentAddress = null;
  isAdminGlobal = false;
  console.log("🔌 Wallet disconnected");

  // Reset UI trên tất cả trang
  const badge = document.getElementById("nav-wallet-badge");
  if (badge) badge.classList.add("hidden");

  // Có thể redirect về connect page
  // window.location.href = "../auth/connect-wallet.html";
}

// ====================== UTILS ======================
export function getContract() {
  return contract;
}
export function getCurrentAddress() {
  return currentAddress;
}
export function isAdmin() {
  return isAdminGlobal;
}

// ====================== LISTENER ======================
export function addAccountChangeListener(callback) {
  if (!window.ethereum) return;

  window.ethereum.on("accountsChanged", async (accounts) => {
    console.log("🔄 Account changed");
    if (accounts && accounts.length > 0) {
      const data = await connectWallet();
      if (callback && data) callback(data);
    } else {
      disconnectWallet();
      if (callback) callback(null);
    }
  });
}
