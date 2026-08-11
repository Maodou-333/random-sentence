const words = {
  subject: ["清晨的邮差", "一只橘猫", "隔壁的诗人", "晚归的旅人", "窗边的绿植", "戴帽子的月亮", "沉默的机器人", "街角的咖啡师", "迷路的风", "图书馆管理员"],
  verb: ["悄悄收藏了", "认真观察着", "突然想起了", "温柔拥抱了", "不小心打翻了", "正在等待", "郑重地交给我", "花了一下午研究", "在梦里遇见了", "决定重新命名"],
  object: ["一场蓝色的雨", "昨天没说完的话", "口袋里的春天", "会发光的秘密", "第九十九封来信", "一杯还没凉的茶", "城市遗忘的影子", "地图上不存在的岛", "所有微小的好运", "那个遥远的答案"]
};

const state = {
  parts: { subject: words.subject[0], verb: words.verb[0], object: words.object[0] },
  locked: { subject: false, verb: false, object: false },
  count: 1
};

const pick = (items, current) => {
  let next = items[Math.floor(Math.random() * items.length)];
  while (next === current) next = items[Math.floor(Math.random() * items.length)];
  return next;
};

const render = () => {
  document.querySelector("#sentence").textContent = `${state.parts.subject}${state.parts.verb}${state.parts.object}。`;
  document.querySelector("#counter").textContent = `第 ${String(state.count).padStart(3, "0")} 次组合`;
  document.querySelectorAll(".part-card").forEach((card) => {
    const part = card.dataset.part;
    const wordButton = card.querySelector(".part-word");
    const lockButton = card.querySelector(".lock");
    wordButton.textContent = state.parts[part];
    wordButton.disabled = state.locked[part];
    lockButton.classList.toggle("is-locked", state.locked[part]);
    lockButton.setAttribute("aria-pressed", String(state.locked[part]));
    lockButton.querySelector(".lock-icon").textContent = state.locked[part] ? "●" : "○";
    lockButton.querySelector("span:last-child").textContent = state.locked[part] ? "已锁定" : "锁定";
  });
};

document.querySelector("#generate").addEventListener("click", () => {
  Object.keys(words).forEach((part) => {
    if (!state.locked[part]) state.parts[part] = pick(words[part], state.parts[part]);
  });
  state.count += 1;
  render();
});

document.querySelectorAll(".part-card").forEach((card) => {
  const part = card.dataset.part;
  card.querySelector(".part-word").addEventListener("click", () => {
    state.parts[part] = pick(words[part], state.parts[part]);
    render();
  });
  card.querySelector(".lock").addEventListener("click", () => {
    state.locked[part] = !state.locked[part];
    render();
  });
});

document.querySelector("#copy").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  const sentence = document.querySelector("#sentence").textContent;
  try {
    await navigator.clipboard.writeText(sentence);
  } catch {
    const area = document.createElement("textarea");
    area.value = sentence;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  button.textContent = "已复制";
  window.setTimeout(() => { button.textContent = "复制句子"; }, 1600);
});

render();
