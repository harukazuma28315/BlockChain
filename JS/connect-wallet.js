// ====================== CONNECT-WALLET.JS ======================
import {
  connectWallet,
  disconnectWallet as blockchainDisconnect,
  addAccountChangeListener,
} from "../../JS/blockchain.js";

// ====================== UI ELEMENTS ======================
const connectBtn = document.getElementById("connect-btn");
const connectBtnLabel = document.getElementById("connect-btn-label");
const connectionContent = document.getElementById("connection-content");
const connectedContent = document.getElementById("connected-content");
const statusBadge = document.getElementById("status-badge");
const navWalletBadge = document.getElementById("nav-wallet-badge");
const navAddress = document.getElementById("nav-address");
const walletAddressEl = document.getElementById("wallet-address");
const roleStatusEl = document.getElementById("role-status");
const noMetaMaskNotice = document.getElementById("no-metamask-notice");

// ====================== DISCONNECT ======================
window.disconnectWallet = function () {
  blockchainDisconnect();
  if (connectionContent) connectionContent.classList.remove("hidden");
  if (connectedContent) connectedContent.classList.add("hidden");
  if (navWalletBadge) navWalletBadge.classList.add("hidden");
  alert("Đã ngắt kết nối ví.");
};

// ====================== MAIN CONNECT ======================
async function handleConnectClick() {
  if (typeof window.ethereum === "undefined") {
    if (noMetaMaskNotice) noMetaMaskNotice.classList.remove("hidden");
    return;
  }
  if (noMetaMaskNotice) noMetaMaskNotice.classList.add("hidden");

  if (connectBtn) connectBtn.disabled = true;
  if (connectBtnLabel) connectBtnLabel.textContent = "Đang kết nối...";

  try {
    const data = await connectWallet();
    if (!data) {
      if (connectBtn) connectBtn.disabled = false;
      if (connectBtnLabel) connectBtnLabel.textContent = "Kết nối MetaMask";
      return;
    }
    showConnectedUI(data.address, data.isAdmin);
  } catch (error) {
    console.error(error);
    if (connectBtn) connectBtn.disabled = false;
    if (connectBtnLabel) connectBtnLabel.textContent = "Kết nối MetaMask";
  }
}

function showConnectedUI(address, isAdminRole) {
  if (connectionContent) connectionContent.classList.add("hidden");
  if (connectedContent) connectedContent.classList.remove("hidden");

  const shortAddress = address.slice(0, 6) + "..." + address.slice(-4);
  if (walletAddressEl) walletAddressEl.textContent = shortAddress;
  if (roleStatusEl) {
    roleStatusEl.textContent = isAdminRole ? "Quản trị viên (Admin)" : "Cử tri";
    roleStatusEl.classList.toggle("text-emerald-600", !isAdminRole);
    roleStatusEl.classList.toggle("text-primary", isAdminRole);
  }

  if (statusBadge) {
    statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500"></span> Đã kết nối`;
  }

  if (navAddress) navAddress.textContent = shortAddress;
  if (navWalletBadge) navWalletBadge.classList.remove("hidden");

  // Tự động chuyển trang
  setTimeout(() => {
    if (isAdminRole) {
      window.location.href = "../admin/admin-dashboard.html";
    } else {
      window.location.href = "../voting/create-ballot.html";
    }
  }, 800);
}

// ====================== INIT ======================
document.addEventListener("DOMContentLoaded", async () => {
  if (connectBtn) connectBtn.addEventListener("click", handleConnectClick);

  // Khôi phục phiên
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts && accounts.length > 0) {
        const data = await connectWallet();
        if (data) showConnectedUI(data.address, data.isAdmin);
      }
    } catch (e) {
      console.error(e);
    }
  }

  addAccountChangeListener((data) => {
    if (data) {
      showConnectedUI(data.address, data.isAdmin);
    } else {
      if (connectionContent) connectionContent.classList.remove("hidden");
      if (connectedContent) connectedContent.classList.add("hidden");
      if (navWalletBadge) navWalletBadge.classList.add("hidden");
    }
  });
});

window.connectWalletPage = { handleConnectClick };
