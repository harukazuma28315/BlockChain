tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-primary-fixed-variant": "#3323cc",
        "surface-dim": "#d3daea",
        "surface-container-lowest": "#ffffff",
        "on-tertiary-fixed-variant": "#7b2f00",
        secondary: "#0058be",
        "on-primary-fixed": "#0f0069",
        "surface-container-highest": "#dce2f3",
        "outline-variant": "#c7c4d8",
        "surface-container-low": "#f0f3ff",
        "inverse-on-surface": "#ebf1ff",
        error: "#ba1a1a",
        "on-error-container": "#93000a",
        "inverse-primary": "#c3c0ff",
        "secondary-fixed-dim": "#adc6ff",
        "surface-container-high": "#e2e8f8",
        "on-secondary": "#ffffff",
        primary: "#3525cd",
        "on-primary": "#ffffff",
        "on-tertiary-fixed": "#351000",
        "tertiary-fixed": "#ffdbcc",
        "on-secondary-container": "#fefcff",
        "primary-fixed": "#e2dfff",
        "surface-bright": "#f9f9ff",
        "secondary-container": "#2170e4",
        "surface-container": "#e7eefe",
        "on-primary-container": "#dad7ff",
        "on-tertiary": "#ffffff",
        "error-container": "#ffdad6",
        outline: "#777587",
        "on-secondary-fixed": "#001a42",
        "surface-variant": "#dce2f3",
        "primary-container": "#4f46e5",
        "inverse-surface": "#2a313d",
        "tertiary-fixed-dim": "#ffb695",
        "primary-fixed-dim": "#c3c0ff",
        tertiary: "#7e3000",
        background: "#f9f9ff",
        "on-tertiary-container": "#ffd2be",
        "secondary-fixed": "#d8e2ff",
        surface: "#f9f9ff",
        "on-error": "#ffffff",
        "on-background": "#151c27",
        "tertiary-container": "#a44100",
        "on-secondary-fixed-variant": "#004395",
        "on-surface": "#151c27",
        "surface-tint": "#4d44e3",
        "on-surface-variant": "#464555",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        md: "16px",
        xs: "4px",
        lg: "24px",
        gutter: "20px",
        "container-max": "1200px",
        sm: "8px",
        base: "4px",
        xl: "40px",
      },
      fontFamily: {
        "mono-label": ["Inter"],
        "label-md": ["Inter"],
        "headline-lg": ["Inter"],
        "body-md": ["Inter"],
        "headline-lg-mobile": ["Inter"],
        "display-lg": ["Inter"],
        "body-sm": ["Inter"],
        "body-lg": ["Inter"],
        "headline-md": ["Inter"],
      },
      fontSize: {
        "mono-label": [
          "13px",
          { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "500" },
        ],
        "label-md": [
          "14px",
          { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "600" },
        ],
        "headline-lg": [
          "32px",
          { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-lg-mobile": [
          "24px",
          { lineHeight: "32px", fontWeight: "600" },
        ],
        "display-lg": [
          "48px",
          { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
      },
    },
  },
};

/* =========================================================================
   TRANG LỊCH SỬ GIAO DỊCH BLOCKCHAIN — tích hợp ethers.js
   Toàn bộ danh sách được dựng lại thật từ event log của Smart Contract
   (không còn dữ liệu localStorage mô phỏng).
   ========================================================================= */
import {
  initAdminPage,
  getContract,
  getProvider,
  fetchAllTransactions,
} from "./admin-common.js";

let cachedTx = [];

function bvStatusPill(status) {
  if (status === "success") {
    return `<span class="inline-flex items-center gap-1 px-sm py-xs bg-emerald-100 text-emerald-700 rounded-full font-label-md text-[12px]"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-status"></span>Thành công</span>`;
  }
  if (status === "pending") {
    return `<span class="inline-flex items-center gap-1 px-sm py-xs bg-amber-100 text-amber-700 rounded-full font-label-md text-[12px]"><span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-status"></span>Đang xử lý</span>`;
  }
  return `<span class="inline-flex items-center gap-1 px-sm py-xs bg-error-container text-on-error-container rounded-full font-label-md text-[12px]"><span class="w-1.5 h-1.5 rounded-full bg-error"></span>Thất bại</span>`;
}

function shortAddr(addr) {
  if (!addr) return "—";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function renderTransactions() {
  const tbody = document.getElementById("tx-table-body");
  const emptyState = document.getElementById("tx-empty-state");
  if (!tbody) return;

  const term = (document.getElementById("tx-search")?.value || "")
    .toLowerCase()
    .trim();
  const filtered = cachedTx.filter(
    (tx) =>
      tx.hash.toLowerCase().includes(term) ||
      (tx.wallet || "").toLowerCase().includes(term) ||
      tx.type.toLowerCase().includes(term),
  );

  const countEl = document.getElementById("tx-count");
  if (countEl)
    countEl.textContent = `Hiển thị ${filtered.length} trên tổng số ${cachedTx.length} giao dịch`;

  if (emptyState) emptyState.classList.toggle("hidden", filtered.length > 0);

  tbody.innerHTML = filtered
    .map(
      (tx) => `
    <tr class="hover:bg-surface-container-lowest transition-colors">
      <td class="px-lg py-md">
        <p class="font-mono-label text-mono-label text-primary">${tx.hash.slice(0, 10)}...${tx.hash.slice(-6)}</p>
        <p class="font-body-sm text-body-sm text-on-surface-variant">${tx.type}</p>
      </td>
      <td class="px-lg py-md font-mono-label text-mono-label text-on-surface">${shortAddr(tx.wallet)}</td>
      <td class="px-lg py-md font-mono-label text-mono-label text-on-surface-variant">#${tx.block.toLocaleString("vi-VN")}</td>
      <td class="px-lg py-md font-body-sm text-body-sm text-on-surface-variant">${tx.time}</td>
      <td class="px-lg py-md text-center">${bvStatusPill(tx.status)}</td>
    </tr>`,
    )
    .join("");

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  set("tx-stat-total", cachedTx.length.toLocaleString("vi-VN"));
  set(
    "tx-stat-success",
    cachedTx.filter((t) => t.status === "success").length.toLocaleString("vi-VN"),
  );
  set(
    "tx-stat-block",
    cachedTx.length ? "#" + cachedTx[0].block.toLocaleString("vi-VN") : "—",
  );
}

async function refreshAndRender() {
  const contract = getContract();
  const provider = getProvider();
  const tbody = document.getElementById("tx-table-body");
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-lg py-lg text-center text-on-surface-variant font-body-sm text-body-sm">Đang tải lịch sử giao dịch từ blockchain...</td></tr>`;
  }
  cachedTx = contract && provider ? await fetchAllTransactions(contract, provider, 300) : [];
  renderTransactions();
}

document.addEventListener("DOMContentLoaded", async () => {
  await initAdminPage((state) => {
    if (state.connected) refreshAndRender();
    else renderTransactions();
  });

  const search = document.getElementById("tx-search");
  if (search) search.addEventListener("input", renderTransactions);
  const refreshBtn = document.getElementById("tx-refresh-btn");
  if (refreshBtn) refreshBtn.addEventListener("click", refreshAndRender);
});
