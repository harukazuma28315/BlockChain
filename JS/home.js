// ====================== HOME.JS ======================
// Landing page - Kết nối ví và điều hướng theo vai trò

import {
  connectWallet,
  addAccountChangeListener,
} from "../../JS/blockchain.js";

// ====================== UI HELPERS ======================
function bvShortAddress(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function bvSetConnectButtonsLoading(isLoading) {
  document.querySelectorAll(".bv-connect-btn").forEach((btn) => {
    btn.disabled = isLoading;
    const label = btn.querySelector(".bv-connect-btn-label");
    if (label) {
      label.dataset.originalText =
        label.dataset.originalText || label.textContent;
      label.textContent = isLoading
        ? "Đang kết nối..."
        : label.dataset.originalText;
    }
  });
}

function bvUpdateNavBadge(address) {
  const badge = document.getElementById("nav-wallet-badge");
  const addrEl = document.getElementById("nav-address");
  if (badge && addrEl) {
    addrEl.textContent = bvShortAddress(address);
    badge.classList.remove("hidden");
    badge.classList.add("flex");
  }
}

function bvShowToast(message, type = "info") {
  const toast = document.getElementById("bv-toast");
  if (!toast) return;

  const styles = {
    info: "bg-surface-container-high text-on-surface border-outline-variant",
    error: "bg-error-container text-on-error-container border-error",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  toast.className = `fixed bottom-6 right-6 z-[100] max-w-sm px-6 py-4 rounded-xl shadow-lg font-body-sm text-body-sm border transition-all duration-300 ${styles[type] || styles.info}`;
  toast.textContent = message;

  requestAnimationFrame(() =>
    toast.classList.remove("opacity-0", "translate-y-2"),
  );

  setTimeout(() => toast.classList.add("opacity-0", "translate-y-2"), 4000);
}

// ====================== CONNECT & ROUTE ======================
async function bvConnectAndRoute() {
  bvSetConnectButtonsLoading(true);

  try {
    const data = await connectWallet();
    if (!data) throw new Error("Không kết nối được ví");

    bvUpdateNavBadge(data.address);
    await bvRouteByRole(data);
  } catch (err) {
    console.error(err);
    bvShowToast(err.message || "Kết nối thất bại", "error");
  } finally {
    bvSetConnectButtonsLoading(false);
  }
}

// ====================== ROUTE BY ROLE ======================
async function bvRouteByRole(data) {
  const { address, isAdmin: isAdminRole, contract } = data;

  if (isAdminRole) {
    bvShowToast("Chào Quản trị viên!", "success");
    setTimeout(
      () => (window.location.href = "../admin/admin-dashboard.html"),
      800,
    );
    return;
  }

  try {
    const voter = await contract.getVoter(address);
    if (voter.verified && voter.active) {
      bvShowToast("Chào Cử tri!", "success");
      setTimeout(
        () => (window.location.href = "../voting/create-ballot.html"),
        800,
      );
    } else {
      bvShowToast("Bạn chưa được xác thực hoặc bị khóa.", "error");
    }
  } catch (err) {
    bvShowToast("Địa chỉ ví chưa được đăng ký làm cử tri.", "error");
  }
}

// ====================== INIT ======================
document.addEventListener("DOMContentLoaded", async () => {
  // Attach click listeners
  document.querySelectorAll(".bv-connect-btn").forEach((btn) => {
    btn.addEventListener("click", bvConnectAndRoute);
  });

  // Restore session
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts && accounts.length > 0) {
        const data = await connectWallet();
        if (data) bvUpdateNavBadge(data.address);
      }
    } catch (e) {
      console.log("Chưa có phiên kết nối.");
    }
  }

  // Account change listener
  addAccountChangeListener((data) => {
    if (data) bvUpdateNavBadge(data.address);
  });
});
