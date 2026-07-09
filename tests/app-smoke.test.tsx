import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../src/app/App";

describe("App", () => {
  it("renders starter title", () => {
    render(<App />);
    expect(screen.getByText("災害資訊整理工作台")).toBeInTheDocument();
  });

  it("keeps the home page focused on phase 0 tabs", () => {
    render(<App />);

    expect(
      screen.getByRole("button", { name: "原始資訊" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "整理工作台" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "通報" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "地點" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "志工任務" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "人員指派" }),
    ).not.toBeInTheDocument();
  });

  it("shows review states in the phase 0 workbench", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "整理工作台" }));

    expect(
      screen.getByText(
        "第一階段的成功不是分類正確，而是把為什麼現在還不能判斷說清楚。",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText("待人工確認").length).toBeGreaterThan(0);
    expect(screen.getAllByText("未查核").length).toBeGreaterThan(0);
  });

  it("supports phase 0 editable safety drafts", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "整理工作台" }));

    expect(screen.getByText("可編輯整理草稿")).toBeInTheDocument();
    expect(screen.getAllByText("6 筆").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("不能直接變成志工任務")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "刪除草稿" }));

    expect(screen.getAllByText("尚未建立整理草稿").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: "建立安全邊界草稿" }),
    ).toBeInTheDocument();
  });

  it("filters draft records by candidate need and location", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "整理工作台" }));

    expect(screen.getByLabelText("人力或物資需求")).toBeInTheDocument();
    expect(screen.getByLabelText("鄉鎮/地點候選")).toBeInTheDocument();
    expect(screen.getByLabelText("草稿人力或物資需求候選")).toBeInTheDocument();
    expect(screen.getByLabelText("草稿鄉鎮/地點候選")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("人力或物資需求"), {
      target: { value: "utility_repair" },
    });

    expect(screen.getByText("顯示 1 / 12 筆")).toBeInTheDocument();
    expect(screen.getAllByText("M-003").length).toBeGreaterThan(0);

    fireEvent.change(screen.getByLabelText("鄉鎮/地點候選"), {
      target: { value: "xipan_candidate" },
    });

    expect(screen.getByText("沒有符合目前篩選的草稿。")).toBeInTheDocument();
  });
});
