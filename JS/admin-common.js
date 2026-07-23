// ====================== ADMIN-COMMON.JS ======================
// Logic dùng chung cho MỌI trang Admin: kết nối MetaMask thật qua blockchain.js,
// hiển thị badge ví trên header, khóa/mở các nút [data-admin-only] tùy theo
// quyền Admin thật lấy từ Smart Contract (owner()), và toast thông báo.
import {
  connectWallet,
  getContract,
  addAccountChangeListener,
} from "./blockchain.js";
import { shortAddr } from "./election-utils.js";

let currentState = { address: null, isAdmin: false, contract: null, signer: null };

export function getState() {
  return currentState;
}

export function getAdminContract() {
  return currentState.contract || getContract();
}

/* ============================ TOAST ============================ */
export function toast(message, type = "info") {
  let el = document.getElementById("bv-toast-el");
  if (!el) {
    el = document.createElement("div");
    el.id = "bv-toast-el";
    document.body.appendChild(el);
  }
  const styles = {
    info: "bg-surface-container-high text-on-surface border-outline-variant",
    error: "bg-red-50 text-red-700 border-red-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  el.className = `fixed bottom-6 right-6 z-[200] max-w-sm px-4 py-3 rounded-xl shadow-lg text-sm font-medium border transition-all duration-300 opacity-0 translate-y-2 ${styles[type] || styles.info}`;
  el.textContent = message;
  requestAnimationFrame(() =>
    el.classList.remove("opacity-0", "translate-y-2"),
  );
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.add("opacity-0", "translate-y-2"), 4000);
}

/* ============================ WALLET BADGE ============================ */
export function renderWalletBadge() {
  const { address, isAdmin: admin } = currentState;
  const addrEl = document.getElementById("wallet-address");
  const statusEl = document.getElementById("wallet-status");
  const badgeEl = document.getElementById("wallet-badge");
  const connectBtn = document.getElementById("connect-wallet-btn");
  const dot = document.getElementById("system-status-dot-header");

  if (addrEl)
    addrEl.textContent = address ? shortAddr(address) : "Chưa kết nối";
  if (statusEl) {
    if (address && admin) {
      statusEl.textContent = "Connected (Admin)";
      statusEl.className = "text-[11px] text-emerald-600 font-medium";
    } else if (address && !admin) {
      statusEl.textContent = "Ví không có quyền Admin";
      statusEl.className = "text-[11px] text-error font-medium";
    } else {
      statusEl.textContent = "Chưa kết nối";
      statusEl.className = "text-[11px] text-on-surface-variant font-medium";
    }
  }
  if (badgeEl) badgeEl.classList.toggle("opacity-50", !address);
  if (connectBtn)
    connectBtn.textContent = address ? shortAddr(address) : "Kết nối ví Admin";
  if (dot)
    dot.className = `w-2 h-2 rounded-full ${address && admin ? "bg-emerald-500" : "bg-outline"}`;
}

/** Khóa các nút [data-admin-only] nếu ví chưa kết nối hoặc không phải Admin thật (owner() trên contract). */
export function guardAdmin() {
  const isOk = !!currentState.address && currentState.isAdmin;
  const warningEl = document.getElementById("admin-guard-warning");
  if (warningEl) warningEl.classList.toggle("hidden", isOk);
  document.querySelectorAll("[data-admin-only]").forEach((el) => {
    el.disabled = !isOk;
    el.classList.toggle("opacity-50", !isOk);
    el.classList.toggle("cursor-not-allowed", !isOk);
  });
  return isOk;
}

async function handleConnectClick() {
  const data = await connectWallet();
  if (!data) return;
  currentState = data;
  renderWalletBadge();
  guardAdmin();
  toast(
    data.isAdmin
      ? "Đã kết nối ví Admin thành công."
      : "Ví này không có quyền Admin trên Smart Contract (không phải owner()).",
    data.isAdmin ? "success" : "error",
  );
  window.dispatchEvent(new CustomEvent("bv:wallet-ready", { detail: currentState }));
}

/**
 * Khởi tạo badge ví + guard cho 1 trang Admin. Gọi 1 lần khi DOMContentLoaded.
 * Trả về Promise<state>. state.contract === null nếu ví chưa kết nối.
 */
export function initAdminWallet() {
  return new Promise((resolve) => {
    const connectBtn = document.getElementById("connect-wallet-btn");
    if (connectBtn) connectBtn.addEventListener("click", handleConnectClick);

    (async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts && accounts.length > 0) {
            const data = await connectWallet();
            if (data) currentState = data;
          }
        } catch (e) {
          console.error("Không thể tự động kết nối ví:", e);
        }
      }
      renderWalletBadge();
      guardAdmin();
      resolve(currentState);
    })();

    addAccountChangeListener((data) => {
      currentState = data || {
        address: null,
        isAdmin: false,
        contract: null,
        signer: null,
      };
      renderWalletBadge();
      guardAdmin();
      window.dispatchEvent(
        new CustomEvent("bv:wallet-ready", { detail: currentState }),
      );
    });
  });
}

/** Bọc 1 thao tác ghi (write) vào contract: kiểm tra quyền, gửi tx, chờ mined, báo lỗi rõ ràng. */
export async function runTx(txPromiseFactory, { pendingMsg, successMsg } = {}) {
  if (!guardAdmin()) {
    toast("Bạn cần kết nối ví Admin (owner của contract) để thực hiện thao tác này.", "error");
    return null;
  }
  try {
    if (pendingMsg) toast(pendingMsg, "info");
    const tx = await txPromiseFactory();
    const receipt = await tx.wait();
    if (successMsg) toast(successMsg, "success");
    return receipt;
  } catch (err) {
    console.error(err);
    const reason =
      err?.reason || err?.shortMessage || err?.message || "Giao dịch thất bại.";
    toast(`Lỗi: ${reason}`, "error");
    return null;
  }
}
