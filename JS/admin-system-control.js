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

// ====================== ADMIN-SYSTEM-CONTROL.JS ======================
// Trang Điều khiển cuộc bầu cử — tích hợp THẬT với Smart Contract.
// Chuyển trạng thái: contract.changeElectionStatus(electionId, newStatusEnum)
// Contract chỉ cho phép trạng thái mới = trạng thái hiện tại + 1 (đúng thứ
// tự Pending -> Registration -> Verification -> Voting -> Ended), khớp
// hoàn toàn với luồng 4 giai đoạn của giao diện này.
import { getContract, getReadContract } from "./blockchain.js";
import { initAdminWallet, toast, runTx } from "./admin-common.js";
import {
  getActiveElectionId,
  getElectionPlain,
  getAllVotersPlain,
  fetchAllEvents,
  describeEvent,
  shortAddr,
  statusEnumFromKey,
} from "./election-utils.js";

let activeElectionId = null;
const urlParams = new URLSearchParams(window.location.search);
const requestedElectionId = urlParams.has("electionId")
  ? BigInt(urlParams.get("electionId"))
  : null;

const BV_STAGES = [
  {
    key: "registration",
    label: "Mở đăng ký",
    icon: "how_to_reg",
    desc: "Cho phép cử tri và ứng viên đăng ký tham gia cuộc bầu cử.",
  },
  {
    key: "verification",
    label: "Mở xác thực",
    icon: "verified_user",
    desc: "Admin xác thực danh sách cử tri và ứng viên hợp lệ.",
  },
  {
    key: "voting",
    label: "Mở bỏ phiếu",
    icon: "how_to_vote",
    desc: "Kích hoạt hợp đồng thông minh, cho phép cử tri bỏ phiếu.",
  },
  {
    key: "ended",
    label: "Kết thúc bỏ phiếu",
    icon: "stop_circle",
    desc: "Đóng cổng bình chọn và chốt kết quả cuối cùng trên chuỗi.",
  },
];

function bvStageIndex(statusKey) {
  const order = ["draft", "registration", "verification", "voting", "ended"];
  return order.indexOf(statusKey);
}

async function loadControlPage() {
  const contract = getContract();
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  if (!contract) {
    set("election-name-display", "Kết nối ví Admin để tải dữ liệu...");
    return;
  }

  activeElectionId =
    requestedElectionId !== null
      ? requestedElectionId
      : await getActiveElectionId(contract);
  if (activeElectionId === null) {
    set(
      "election-name-display",
      'Chưa có cuộc bầu cử nào. Hãy tạo ở trang "Quản lý bầu cử".',
    );
    const stagesEl = document.getElementById("stage-controls");
    if (stagesEl) stagesEl.innerHTML = "";
    return;
  }

  // Kiểm tra electionId hợp lệ (phòng khi người dùng tự sửa tay trên URL)
  const electionCount = await contract.electionCount();
  if (activeElectionId >= electionCount) {
    set(
      "election-name-display",
      `Không tìm thấy cuộc bầu cử #${activeElectionId}.`,
    );
    const stagesEl = document.getElementById("stage-controls");
    if (stagesEl) stagesEl.innerHTML = "";
    return;
  }

  const [election, voters, provider] = await Promise.all([
    getElectionPlain(contract, activeElectionId),
    getAllVotersPlain(contract),
    Promise.resolve(contract.provider ?? contract.runner?.provider),
  ]);

  set("election-name-display", `${election.title} (#${election.id})`);
  const statusIcon = {
    draft: "⚪",
    registration: "🟠",
    verification: "🔵",
    voting: "🟢",
    ended: "⚫",
  }[election.statusKey];
  const statusText = {
    draft: "Chưa khởi tạo",
    registration: "Đang mở đăng ký",
    verification: "Đang xác thực",
    voting: "Đang bỏ phiếu",
    ended: "Đã kết thúc",
  }[election.statusKey];
  set("current-status-label", `${statusIcon} ${statusText}`);

  const totalVotes = Number(await contract.totalVotes(activeElectionId));
  const turnout = voters.length
    ? ((totalVotes / voters.length) * 100).toFixed(1)
    : "0.0";
  set("rt-total-votes", totalVotes.toLocaleString("vi-VN"));
  set("rt-turnout", `${turnout}%`);

  if (provider) {
    try {
      const blockNumber = await provider.getBlockNumber();
      set("rt-block", "#" + blockNumber.toLocaleString("vi-VN"));
    } catch (e) {
      /* ignore */
    }
  }

  const progressMap = {
    draft: 5,
    registration: 30,
    verification: 55,
    voting: 80,
    ended: 100,
  };
  const progressEl = document.getElementById("stage-progress-bar");
  const progressLabel = document.getElementById("stage-progress-label");
  const pct = progressMap[election.statusKey] ?? 5;
  if (progressEl) progressEl.style.width = pct + "%";
  if (progressLabel) progressLabel.textContent = pct + "% hoàn thành";

  const stagesEl = document.getElementById("stage-controls");
  const currentIdx = bvStageIndex(election.statusKey);
  if (stagesEl) {
    stagesEl.innerHTML = BV_STAGES.map((stage, i) => {
      const stageIdx = i + 1;
      const isDone =
        stageIdx < currentIdx ||
        (election.statusKey === "ended" && stageIdx <= currentIdx);
      const isCurrent = stageIdx === currentIdx;
      const isNext = stageIdx === currentIdx + 1;
      const isLocked = !isNext && !isCurrent && !isDone;
      const isEndedStage = stage.key === "ended";

      let btnHtml;
      if (isDone && !isCurrent) {
        btnHtml = `<button disabled class="w-full py-md bg-primary-fixed text-primary font-label-md text-label-md rounded-xl flex items-center justify-center gap-sm cursor-default">
            <span class="material-symbols-outlined">check_circle</span> Đã hoàn tất</button>`;
      } else if (isNext) {
        btnHtml = `<button data-admin-only onclick="bvSetStage('${stage.key}')" class="w-full py-md ${isEndedStage ? "bg-error text-on-error hover:bg-[#a11717]" : "bg-primary text-on-primary hover:bg-on-primary-fixed-variant"} font-label-md text-label-md rounded-xl active:scale-95 transition-all shadow-md flex items-center justify-center gap-sm">
            <span class="material-symbols-outlined">${stage.icon}</span> ${stage.label}</button>`;
      } else {
        btnHtml = `<button disabled class="w-full py-md bg-outline-variant text-on-surface-variant font-label-md text-label-md rounded-xl cursor-not-allowed flex items-center justify-center gap-sm">
            <span class="material-symbols-outlined">${stage.icon}</span> ${stage.label}</button>`;
      }

      return `
      <div class="p-lg ${isEndedStage ? "bg-surface border-2 border-error-container" : "bg-surface-container-low border border-outline-variant"} rounded-xl flex flex-col justify-between ${isLocked ? "opacity-60" : ""}">
        <div>
          <div class="flex justify-between items-start mb-xs">
            <h3 class="font-label-md text-label-md">Giai đoạn ${stageIdx}: ${stage.label}</h3>
            ${isEndedStage ? '<span class="px-sm py-[2px] bg-error-container text-on-error-container text-[10px] font-bold rounded-full uppercase tracking-wider">Khẩn cấp</span>' : ""}
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant mb-lg">${stage.desc}</p>
        </div>
        ${btnHtml}
      </div>`;
    }).join("");
  }

  // Nhật ký thao tác on-chain gần đây (đọc trực tiếp từ event log của contract)
  const logEl = document.getElementById("control-log-list");
  if (logEl) {
    logEl.innerHTML = `<p class="font-body-sm text-body-sm text-on-surface-variant p-lg">Đang tải log từ blockchain...</p>`;
    try {
      const readContract = getReadContract();
      const events = await fetchAllEvents(readContract, 6);
      const readProvider =
        readContract.provider ?? readContract.runner?.provider;
      const logs = await Promise.all(
        events.map((ev) => describeEvent(ev, readProvider)),
      );
      logEl.innerHTML = logs.length
        ? logs
            .map(
              (tx, i) => `
      <div class="flex gap-md group">
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary border border-secondary/20">
            <span class="material-symbols-outlined text-[18px]">history</span>
          </div>
          ${i < logs.length - 1 ? '<div class="w-[2px] h-full bg-outline-variant mt-sm"></div>' : ""}
        </div>
        <div class="pb-md">
          <div class="flex items-center gap-sm mb-xs">
            <span class="font-label-md text-label-md">${tx.type}</span>
            <span class="font-body-sm text-body-sm text-on-surface-variant">${tx.time}</span>
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Ví: <code class="bg-surface-container px-sm py-[2px] rounded text-primary">${shortAddr(tx.wallet)}</code></p>
        </div>
      </div>`,
            )
            .join("")
        : `<p class="font-body-sm text-body-sm text-on-surface-variant p-lg">Chưa có thao tác nào được ghi nhận.</p>`;
    } catch (err) {
      console.error(err);
      logEl.innerHTML = `<p class="font-body-sm text-body-sm text-on-surface-variant p-lg">Không tải được log on-chain.</p>`;
    }
  }
}

window.bvSetStage = async function bvSetStage(stageKey) {
  const labelMap = {
    registration: "Mở đăng ký",
    verification: "Mở xác thực",
    voting: "Mở bỏ phiếu",
    ended: "Kết thúc bỏ phiếu",
  };
  if (
    stageKey === "ended" &&
    !confirm(
      "Kết thúc bầu cử sẽ chốt kết quả vĩnh viễn trên blockchain và không thể hoàn tác. Tiếp tục?",
    )
  ) {
    return;
  }
  if (activeElectionId === null) return;

  const receipt = await runTx(
    () =>
      getContract().changeElectionStatus(
        activeElectionId,
        statusEnumFromKey(stageKey),
      ),
    {
      pendingMsg: `Đang gửi giao dịch "${labelMap[stageKey]}" lên blockchain...`,
      successMsg: `${labelMap[stageKey]} thành công (đã ghi on-chain).`,
    },
  );
  if (receipt) await loadControlPage();
};

document.addEventListener("DOMContentLoaded", async () => {
  await initAdminWallet();
  await loadControlPage();

  document.querySelectorAll(".group").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const icon = item.querySelector(".material-symbols-outlined");
      if (icon) icon.style.transform = "scale(1.1)";
    });
    item.addEventListener("mouseleave", () => {
      const icon = item.querySelector(".material-symbols-outlined");
      if (icon) icon.style.transform = "scale(1)";
    });
  });

  window.addEventListener("bv:wallet-ready", loadControlPage);
});
